/**
 * Script de seed com dados de exemplo
 */

require("dotenv").config();
const { HealthUnit, Medicine, Availability } = require("../models");

// Dados de exemplo das unidades de saúde de Rio Branco
const healthUnitsData = [
  {
    nome: "UBS Cidade Nova",
    tipo: "UBS",
    endereco: "Rua das Flores, 123",
    bairro: "Cidade Nova",
    cidade: "Rio Branco",
    estado: "AC",
    cep: "69911-000",
    latitude: -9.9754,
    longitude: -67.8249,
    telefone: "(68) 3901-1234",
    horarioFuncionamento: {
      semana: { inicio: "07:00", fim: "17:00" },
      sabado: { inicio: "07:00", fim: "12:00" },
      domingo: { fechado: true },
    },
    servicos: {
      farmacia: true,
      consultaMedica: true,
      vacinacao: true,
      exames: false,
      urgencia: false,
    },
    ativo: true,
    verificado: true,
  },
  {
    nome: "Hospital de Urgência e Emergência",
    tipo: "Hospital",
    endereco: "BR-364, Km 2",
    bairro: "Industrial",
    cidade: "Rio Branco",
    estado: "AC",
    cep: "69920-000",
    latitude: -9.9567,
    longitude: -67.8408,
    telefone: "(68) 3901-5000",
    horarioFuncionamento: {
      semana: { inicio: "00:00", fim: "23:59" },
      sabado: { inicio: "00:00", fim: "23:59" },
      domingo: { inicio: "00:00", fim: "23:59" },
    },
    servicos: {
      farmacia: true,
      consultaMedica: true,
      vacinacao: false,
      exames: true,
      urgencia: true,
    },
    ativo: true,
    verificado: true,
  },
  {
    nome: "UBS Vitória",
    tipo: "UBS",
    endereco: "Rua da Vitória, 456",
    bairro: "Vitória",
    cidade: "Rio Branco",
    estado: "AC",
    cep: "69912-000",
    latitude: -9.9234,
    longitude: -67.8156,
    telefone: "(68) 3901-2345",
    horarioFuncionamento: {
      semana: { inicio: "07:00", fim: "17:00" },
      sabado: { inicio: "07:00", fim: "12:00" },
      domingo: { fechado: true },
    },
    servicos: {
      farmacia: true,
      consultaMedica: true,
      vacinacao: true,
      exames: false,
      urgencia: false,
    },
    ativo: true,
    verificado: true,
  },
];

// Dados de medicamentos comuns
const medicinesData = [
  {
    nome: "Paracetamol",
    nomeGenerico: "Paracetamol",
    categoria: "Analgésico",
    apresentacao: "Comprimido 500mg",
    dosagem: "500mg",
    formaFarmaceutica: "Comprimido",
    necessitaReceita: false,
    tipoReceita: "Não necessita",
    disponibilidadeSus: true,
    farmaciaPopular: true,
    palavrasChave: "paracetamol dor febre analgesico",
    sinonimos: ["Acetaminofeno", "Tylenol"],
    ativo: true,
    verificado: true,
  },
  {
    nome: "Dipirona",
    nomeGenerico: "Dipirona Sódica",
    categoria: "Analgésico",
    apresentacao: "Comprimido 500mg",
    dosagem: "500mg",
    formaFarmaceutica: "Comprimido",
    necessitaReceita: false,
    tipoReceita: "Não necessita",
    disponibilidadeSus: true,
    farmaciaPopular: true,
    palavrasChave: "dipirona dor febre analgesico novalgina",
    sinonimos: ["Novalgina", "Metamizol"],
    ativo: true,
    verificado: true,
  },
  {
    nome: "Omeprazol",
    nomeGenerico: "Omeprazol",
    categoria: "Outros",
    apresentacao: "Cápsula 20mg",
    dosagem: "20mg",
    formaFarmaceutica: "Cápsula",
    necessitaReceita: false,
    tipoReceita: "Não necessita",
    disponibilidadeSus: true,
    farmaciaPopular: true,
    palavrasChave: "omeprazol estomago gastrite azia",
    sinonimos: ["Losec", "Prilosec"],
    ativo: true,
    verificado: true,
  },
  {
    nome: "Losartana",
    nomeGenerico: "Losartana Potássica",
    categoria: "Antihipertensivo",
    apresentacao: "Comprimido 50mg",
    dosagem: "50mg",
    formaFarmaceutica: "Comprimido",
    necessitaReceita: true,
    tipoReceita: "Simples",
    disponibilidadeSus: true,
    farmaciaPopular: true,
    palavrasChave: "losartana pressao hipertensao cardiovascular",
    sinonimos: ["Cozaar"],
    ativo: true,
    verificado: true,
  },
  {
    nome: "Metformina",
    nomeGenerico: "Metformina",
    categoria: "Antidiabético",
    apresentacao: "Comprimido 850mg",
    dosagem: "850mg",
    formaFarmaceutica: "Comprimido",
    necessitaReceita: true,
    tipoReceita: "Simples",
    disponibilidadeSus: true,
    farmaciaPopular: true,
    palavrasChave: "metformina diabetes glicose açucar",
    sinonimos: ["Glifage", "Glucophage"],
    ativo: true,
    verificado: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Criar unidades de saúde
    console.log("📍 Criando unidades de saúde...");
    const units = await HealthUnit.bulkCreate(healthUnitsData, {
      returning: true,
    });
    console.log(`✅ ${units.length} unidades criadas`);

    // Criar medicamentos
    console.log("💊 Criando medicamentos...");
    const medicines = await Medicine.bulkCreate(medicinesData, {
      returning: true,
    });
    console.log(`✅ ${medicines.length} medicamentos criados`);

    // Criar disponibilidades (cada unidade tem alguns medicamentos)
    console.log("🔗 Criando disponibilidades...");
    const availabilities = [];

    for (const unit of units) {
      // Cada unidade terá 3-4 medicamentos disponíveis
      const numMedicines = Math.floor(Math.random() * 2) + 3; // 3 ou 4
      const selectedMedicines = medicines
        .sort(() => 0.5 - Math.random())
        .slice(0, numMedicines);

      for (const medicine of selectedMedicines) {
        availabilities.push({
          healthUnitId: unit.id,
          medicineId: medicine.id,
          disponivel: Math.random() > 0.2, // 80% de chance de estar disponível
          quantidade: Math.floor(Math.random() * 100) + 10,
          unidadeMedida: "Unidade",
          dataUltimaVerificacao: new Date(),
          fonteDado: "Manual",
          confiabilidade: Math.floor(Math.random() * 30) + 70, // 70-100
          ativo: true,
        });
      }
    }

    await Availability.bulkCreate(availabilities);
    console.log(`✅ ${availabilities.length} disponibilidades criadas`);

    console.log("🎉 Seed concluído com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`- ${units.length} unidades de saúde`);
    console.log(`- ${medicines.length} medicamentos`);
    console.log(`- ${availabilities.length} registros de disponibilidade`);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    throw error;
  }
}

async function seedIfEmpty() {
  try {
    // Verificar se já existe dados
    const unitsCount = await HealthUnit.count();
    const medicinesCount = await Medicine.count();

    if (unitsCount === 0 && medicinesCount === 0) {
      console.log("📊 Banco vazio, executando seed...");
      await seed();
    } else {
      console.log(
        `📊 Banco já contém dados (${unitsCount} unidades, ${medicinesCount} medicamentos)`
      );
      console.log("ℹ️  Use --force para recriar os dados");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar dados:", error);
    throw error;
  }
}

if (require.main === module) {
  const forceFlag = process.argv.includes("--force");

  if (forceFlag) {
    seed()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    seedIfEmpty()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { seed, seedIfEmpty };
