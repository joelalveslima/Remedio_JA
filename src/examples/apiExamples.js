/**
 * Exemplo prático de uso do serviço de API com Axios
 * Este arquivo demonstra como usar os novos serviços implementados
 */

import {
  healthUnitsService,
  medicinesService,
  searchService,
  apiHealthCheck,
} from "../services/api";

/**
 * Exemplo 1: Verificar status da API
 */
export const exemploHealthCheck = async () => {
  console.log("🏥 Exemplo: Verificando status da API...");

  const status = await apiHealthCheck();

  if (status.success) {
    console.log("✅ API está online!");
    console.log("📊 Dados do servidor:", status.data);
  } else {
    console.log("❌ API está offline:", status.error);
    console.log("💡 Usando modo fallback com dados locais");
  }

  return status;
};

/**
 * Exemplo 2: Buscar todas as unidades de saúde
 */
export const exemploBuscarUnidades = async () => {
  console.log("🏥 Exemplo: Buscando todas as unidades...");

  const resultado = await healthUnitsService.getAll({
    page: 1,
    limit: 10,
    city: "Rio Branco",
    active: true,
  });

  if (resultado.success) {
    console.log(`✅ Encontradas ${resultado.data.length} unidades`);
    resultado.data.forEach((unidade) => {
      console.log(`   📍 ${unidade.nome} - ${unidade.endereco}`);
    });
  } else {
    console.log("❌ Erro ao buscar unidades:", resultado.error);
  }

  return resultado;
};

/**
 * Exemplo 3: Buscar unidades próximas à localização do usuário
 */
export const exemploBuscarUnidadesProximas = async (latitude, longitude) => {
  console.log("📍 Exemplo: Buscando unidades próximas...");

  const resultado = await healthUnitsService.getNearby(
    latitude,
    longitude,
    5 // raio de 5km
  );

  if (resultado.success) {
    console.log(`✅ Encontradas ${resultado.data.length} unidades próximas`);
    resultado.data.forEach((unidade) => {
      console.log(`   📍 ${unidade.nome} - ${unidade.distancia}km`);
    });
  } else {
    console.log("❌ Erro ao buscar unidades próximas:", resultado.error);
  }

  return resultado;
};

/**
 * Exemplo 4: Buscar medicamentos disponíveis
 */
export const exemploBuscarMedicamentos = async () => {
  console.log("💊 Exemplo: Buscando medicamentos...");

  const resultado = await medicinesService.getAll({
    category: "Analgésico",
    available: true,
    page: 1,
    limit: 20,
  });

  if (resultado.success) {
    console.log(`✅ Encontrados ${resultado.data.length} medicamentos`);
    resultado.data.forEach((medicamento) => {
      console.log(`   💊 ${medicamento.nome} - ${medicamento.categoria}`);
    });
  } else {
    console.log("❌ Erro ao buscar medicamentos:", resultado.error);
  }

  return resultado;
};

/**
 * Exemplo 5: Buscar unidades que têm um medicamento específico
 */
export const exemploUnidadesComMedicamento = async (nomeMedicamento) => {
  console.log(`🔍 Exemplo: Buscando unidades com ${nomeMedicamento}...`);

  const resultado = await searchService.findUnitsWithMedicine(nomeMedicamento, {
    radius: 10,
    onlyAvailable: true,
  });

  if (resultado.success) {
    console.log(
      `✅ Encontradas ${resultado.data.length} unidades com ${nomeMedicamento}`
    );
    resultado.data.forEach((unidade) => {
      console.log(`   🏥 ${unidade.nome} - ${unidade.endereco}`);
      console.log(
        `      💊 Status: ${
          unidade.medicamento.disponivel ? "Disponível" : "Indisponível"
        }`
      );
    });
  } else {
    console.log(
      `❌ Erro ao buscar unidades com ${nomeMedicamento}:`,
      resultado.error
    );
  }

  return resultado;
};

/**
 * Exemplo 6: Busca global inteligente
 */
export const exemploBuscaGlobal = async (termo) => {
  console.log(`🔍 Exemplo: Busca global por "${termo}"...`);

  const resultado = await searchService.search(termo, {
    includeUnits: true,
    includeMedicines: true,
    fuzzy: true,
    limit: 15,
  });

  if (resultado.success) {
    console.log(`✅ Busca retornou ${resultado.data.length} resultados`);

    // Separar resultados por tipo
    const unidades = resultado.data.filter(
      (item) => item.type === "health_unit"
    );
    const medicamentos = resultado.data.filter(
      (item) => item.type === "medicine"
    );

    if (unidades.length > 0) {
      console.log(`   🏥 Unidades encontradas (${unidades.length}):`);
      unidades.forEach((unidade) => {
        console.log(`      📍 ${unidade.nome}`);
      });
    }

    if (medicamentos.length > 0) {
      console.log(`   💊 Medicamentos encontrados (${medicamentos.length}):`);
      medicamentos.forEach((medicamento) => {
        console.log(`      💊 ${medicamento.nome}`);
      });
    }
  } else {
    console.log(`❌ Erro na busca por "${termo}":`, resultado.error);
  }

  return resultado;
};

/**
 * Exemplo 7: Fluxo completo de busca de medicamento
 */
export const exemploFluxoCompleto = async (
  medicamento,
  userLatitude,
  userLongitude
) => {
  console.log(`🚀 Exemplo: Fluxo completo para encontrar ${medicamento}...`);

  try {
    // 1. Verificar se a API está online
    const apiStatus = await apiHealthCheck();
    console.log(
      `   📡 API Status: ${apiStatus.success ? "Online" : "Offline"}`
    );

    // 2. Buscar unidades que têm o medicamento
    const unidadesComMedicamento = await exemploUnidadesComMedicamento(
      medicamento
    );

    if (!unidadesComMedicamento.success) {
      throw new Error("Não foi possível buscar unidades com o medicamento");
    }

    // 3. Se temos localização do usuário, calcular distâncias
    if (userLatitude && userLongitude) {
      const unidadesProximas = await exemploBuscarUnidadesProximas(
        userLatitude,
        userLongitude
      );

      if (unidadesProximas.success) {
        // Combinar dados: unidades com medicamento + distâncias
        console.log(
          "   📊 Combinando dados de disponibilidade e localização..."
        );

        // Aqui você faria a lógica para combinar os dados
        // e ordenar por proximidade + disponibilidade
      }
    }

    // 4. Resultado final
    console.log(`✅ Fluxo completo concluído com sucesso!`);
    return {
      success: true,
      medicamento,
      unidadesEncontradas: unidadesComMedicamento.data?.length || 0,
      temLocalizacao: !!(userLatitude && userLongitude),
    };
  } catch (error) {
    console.log(`❌ Erro no fluxo completo:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Exemplo de uso em um componente React
 */
export const exemploUsoEmComponente = () => {
  // Este é um exemplo de como usar em um componente React
  const buscarDados = async () => {
    try {
      // Buscar unidades
      const unidades = await healthUnitsService.getAll();

      if (unidades.success) {
        // Atualizar estado do componente
        // setUnidadesData(unidades.data);
        console.log("Dados carregados com sucesso!");
      } else {
        // Tratar erro ou usar fallback
        console.log("Usando dados locais como fallback");
        // loadLocalData();
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  return { buscarDados };
};

// Exportar todos os exemplos
export default {
  exemploHealthCheck,
  exemploBuscarUnidades,
  exemploBuscarUnidadesProximas,
  exemploBuscarMedicamentos,
  exemploUnidadesComMedicamento,
  exemploBuscaGlobal,
  exemploFluxoCompleto,
  exemploUsoEmComponente,
};
