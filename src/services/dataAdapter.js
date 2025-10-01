/**
 * Adaptador para converter dados da API para o formato usado pelo app
 * Mantém compatibilidade com o código existente do frontend
 */

import { calculateDistance } from "../utils/locationUtils";

/**
 * Converte dados das unidades da API para o formato usado no app
 */
export const adaptHealthUnitsFromApi = (apiData, userLocation = null) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn("⚠️ Dados de unidades inválidos da API:", apiData);
    return [];
  }

  return apiData.map((unit) => {
    // Calcular distância se localização do usuário estiver disponível
    let distancia = "0.0";
    let isDistanciaReal = false;

    if (userLocation && unit.latitude && unit.longitude) {
      const distanciaCalculada = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(unit.latitude),
        parseFloat(unit.longitude)
      );

      if (distanciaCalculada !== null) {
        distancia = distanciaCalculada.toFixed(1);
        isDistanciaReal = true;
      }
    }

    // Converter disponibilidade para o formato esperado
    const disponibilidade = unit.Availabilities
      ? unit.Availabilities.map((avail) => ({
          remedio: avail.Medicine
            ? avail.Medicine.name
            : "Medicamento desconhecido",
          disponivel: avail.isAvailable === true,
        }))
      : [];

    // Objeto no formato esperado pelo app
    return {
      id: unit.id ? unit.id.toString() : `unit_${Date.now()}`,
      nome: unit.name || "Unidade sem nome",
      distancia,
      latitude: parseFloat(unit.latitude) || 0,
      longitude: parseFloat(unit.longitude) || 0,
      horario: {
        semana: {
          inicio: unit.openingHours || "07:00",
          fim: unit.closingHours || "17:00",
        },
      },
      disponibilidade,
      isDistanciaReal,
      // Dados adicionais da API que podem ser úteis
      _apiData: {
        address: unit.address,
        phone: unit.phone,
        type: unit.type,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      },
    };
  });
};

/**
 * Converte dados de medicamentos da API para o formato usado no app
 */
export const adaptMedicinesFromApi = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn("⚠️ Dados de medicamentos inválidos da API:", apiData);
    return [];
  }

  return apiData.map((medicine) => ({
    id: medicine.id ? medicine.id.toString() : `med_${Date.now()}`,
    nome: medicine.name || "Medicamento sem nome",
    categoria: medicine.category || "medicamento",
    dosagem: medicine.dosage || null,
    fabricante: medicine.manufacturer || null,
    // Dados adicionais da API
    _apiData: {
      description: medicine.description,
      activeIngredient: medicine.activeIngredient,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    },
  }));
};

/**
 * Adapta os dados de disponibilidade da API
 */
export const adaptAvailabilityFromApi = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn("⚠️ Dados de disponibilidade inválidos da API:", apiData);
    return [];
  }

  return apiData.map((avail) => ({
    id: avail.id ? avail.id.toString() : `avail_${Date.now()}`,
    unidadeId: avail.healthUnitId ? avail.healthUnitId.toString() : "unknown",
    medicamentoId: avail.medicineId ? avail.medicineId.toString() : "unknown",
    disponivel: avail.isAvailable === true,
    quantidade: avail.quantity || 0,
    ultimaAtualizacao: avail.updatedAt,
    // Dados relacionais se incluídos
    unidade: avail.HealthUnit
      ? {
          id: avail.HealthUnit.id ? avail.HealthUnit.id.toString() : "unknown",
          nome: avail.HealthUnit.name || "Unidade sem nome",
        }
      : null,
    medicamento: avail.Medicine
      ? {
          id: avail.Medicine.id ? avail.Medicine.id.toString() : "unknown",
          nome: avail.Medicine.name || "Medicamento sem nome",
        }
      : null,
  }));
};

/**
 * Filtra unidades que têm um medicamento específico disponível
 */
export const filterUnitsByMedicine = (units, medicineName) => {
  console.log("🔍 [FILTRO] Iniciando busca por:", medicineName);
  console.log("📋 [FILTRO] Total de unidades:", units?.length || 0);

  // Verificação básica
  if (!units || !Array.isArray(units) || !medicineName) {
    console.log("❌ [FILTRO] Parâmetros inválidos");
    return [];
  }

  const searchTerm = medicineName.toLowerCase().trim();
  console.log("🎯 [FILTRO] Termo processado:", `'${searchTerm}'`);

  // Array para armazenar resultados
  const results = [];

  // Verificar cada unidade
  units.forEach((unit, index) => {
    console.log(`\n🏥 [FILTRO] Unidade ${index + 1}: ${unit.nome}`);

    if (!unit.disponibilidade || !Array.isArray(unit.disponibilidade)) {
      console.log("❌ [FILTRO] Sem disponibilidade válida");
      return;
    }

    // Verificar cada medicamento da unidade
    const medicamentoEncontrado = unit.disponibilidade.find((disp) => {
      const nomeRemedio = (disp.remedio || "").toLowerCase();
      const disponivel = disp.disponivel === true;
      const match = nomeRemedio.includes(searchTerm) && disponivel;

      console.log(
        `  💊 ${disp.remedio}: ${disponivel ? "✅" : "❌"} | Match: ${
          match ? "SIM" : "NÃO"
        }`
      );

      return match;
    });

    // Se encontrou o medicamento, adicionar aos resultados
    if (medicamentoEncontrado) {
      console.log(`✅ [FILTRO] ADICIONADO: ${unit.nome}`);
      results.push({
        ...unit,
        remedio: medicamentoEncontrado.remedio,
        disponivel: medicamentoEncontrado.disponivel,
      });
    }
  });

  console.log(
    `🎯 [FILTRO] RESULTADO FINAL: ${results.length} unidades encontradas`
  );
  console.log(
    "📝 [FILTRO] Nomes das unidades:",
    results.map((u) => u.nome)
  );

  return results.sort(
    (a, b) => parseFloat(a.distancia || 0) - parseFloat(b.distancia || 0)
  );
};

/**
 * Normaliza string para busca (remove acentos, converte para minúsculas)
 */
export const normalizeSearchString = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
};

/**
 * Função utilitária para combinar dados da API com fallback local
 */
export const combineApiWithLocalData = (
  apiData,
  localData,
  userLocation = null
) => {
  // Se a API retornou dados, usar eles
  if (apiData && apiData.length > 0) {
    console.log("✅ Usando dados da API");
    return adaptHealthUnitsFromApi(apiData, userLocation);
  }

  // Caso contrário, usar dados locais como fallback
  console.log("⚠️ API indisponível, usando dados locais como fallback");
  console.log("📊 Dados locais originais:", localData.length);
  console.log("🔍 Primeira unidade original:", localData[0]);

  const processedData = localData.map((unit) => ({
    ...unit,
    isDistanciaReal: false,
    _source: "local",
  }));

  console.log("📊 Dados locais processados:", processedData.length);
  console.log("🔍 Primeira unidade processada:", processedData[0]);

  return processedData;
};

/**
 * Função para validar se os dados da API estão no formato esperado
 */
export const validateApiResponse = (response) => {
  if (!response) {
    return { valid: false, error: "Resposta vazia" };
  }

  if (!response.success) {
    return {
      valid: false,
      error: response.error || "Erro desconhecido da API",
    };
  }

  if (!response.data) {
    return { valid: false, error: "Dados ausentes na resposta" };
  }

  return { valid: true };
};

/**
 * Função para criar objeto de erro padronizado
 */
export const createErrorResponse = (
  message,
  type = "unknown",
  details = null
) => {
  return {
    success: false,
    error: message,
    type,
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Função para logs estruturados de debug
 */
export const logApiOperation = (operation, data, success = true) => {
  const timestamp = new Date().toISOString();
  const emoji = success ? "✅" : "❌";

  console.log(`${emoji} ${timestamp} - ${operation}:`, {
    success,
    dataType: Array.isArray(data) ? "array" : typeof data,
    dataLength: Array.isArray(data) ? data.length : null,
    firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
  });
};

export default {
  adaptHealthUnitsFromApi,
  adaptMedicinesFromApi,
  adaptAvailabilityFromApi,
  filterUnitsByMedicine,
  normalizeSearchString,
  combineApiWithLocalData,
  validateApiResponse,
  createErrorResponse,
  logApiOperation,
};
