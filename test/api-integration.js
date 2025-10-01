/**
 * Script de teste para verificar a integração entre o app e a API
 * Execute este arquivo para testar a conectividade
 */

// Simulando ambiente React Native (para teste local)
if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}

// Importar nossos serviços
const { healthUnitsService, apiHealthCheck } = require("../src/services/api");

async function testApiIntegration() {
  console.log("🧪 Iniciando testes de integração da API...\n");

  try {
    // Teste 1: Health Check
    console.log("1️⃣ Testando health check...");
    const healthResult = await apiHealthCheck();

    if (healthResult.success) {
      console.log("✅ Health check passou!");
      console.log(`   Status: ${healthResult.status}`);
    } else {
      console.log("❌ Health check falhou:", healthResult.error);
      return;
    }

    // Teste 2: Buscar todas as unidades
    console.log("\n2️⃣ Testando busca de unidades...");
    const unitsResult = await healthUnitsService.getAll();

    if (unitsResult.success) {
      console.log("✅ Busca de unidades passou!");
      console.log(`   Encontradas: ${unitsResult.data.length} unidades`);

      if (unitsResult.data.length > 0) {
        const firstUnit = unitsResult.data[0];
        console.log(`   Primeira unidade: ${firstUnit.name}`);
        console.log(
          `   Localização: ${firstUnit.latitude}, ${firstUnit.longitude}`
        );
        console.log(
          `   Medicamentos disponíveis: ${
            firstUnit.Availabilities?.length || 0
          }`
        );
      }
    } else {
      console.log("❌ Busca de unidades falhou:", unitsResult.error);
    }

    // Teste 3: Buscar por medicamento específico
    console.log("\n3️⃣ Testando busca por medicamento...");
    const medicineResult = await healthUnitsService.getByMedicine("Dipirona");

    if (medicineResult.success) {
      console.log("✅ Busca por medicamento passou!");
      console.log(`   Unidades com Dipirona: ${medicineResult.data.length}`);
    } else {
      console.log("❌ Busca por medicamento falhou:", medicineResult.error);
    }

    console.log("\n🎉 Todos os testes de integração foram concluídos!");
  } catch (error) {
    console.error("💥 Erro durante os testes:", error.message);
  }
}

// Executar testes apenas se for executado diretamente
if (require.main === module) {
  testApiIntegration();
}

module.exports = { testApiIntegration };
