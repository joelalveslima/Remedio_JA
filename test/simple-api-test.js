/**
 * Teste simples para verificar conectividade da API
 */

const http = require("http");

function testApiSimple() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/health",
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve({
            success: true,
            status: res.statusCode,
            data: result,
          });
        } catch (error) {
          resolve({
            success: false,
            error: "Resposta inválida da API",
            rawData: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
        code: error.code,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        success: false,
        error: "Timeout na conexão com a API",
      });
    });

    req.setTimeout(5000);
    req.end();
  });
}

async function runTest() {
  console.log("🔍 Testando conectividade simples com a API...\n");

  const result = await testApiSimple();

  if (result.success) {
    console.log("✅ API acessível!");
    console.log(`   Status: ${result.status}`);
    console.log(`   Status API: ${result.data.status}`);
    console.log(`   Versão: ${result.data.version}`);
    console.log(`   Ambiente: ${result.data.environment}`);

    if (result.data.statistics) {
      console.log("\n📊 Estatísticas:");
      console.log(`   Unidades: ${result.data.statistics.unidades}`);
      console.log(`   Medicamentos: ${result.data.statistics.medicamentos}`);
      console.log(
        `   Disponibilidades: ${result.data.statistics.disponibilidades}`
      );
    }
  } else {
    console.log("❌ Erro ao acessar API:");
    console.log(`   Erro: ${result.error}`);
    console.log(`   Código: ${result.code || "N/A"}`);

    if (result.rawData) {
      console.log(`   Dados brutos: ${result.rawData.substring(0, 200)}...`);
    }

    console.log("\n💡 Possíveis soluções:");
    console.log(
      "   1. Verifique se a API está rodando (npm run dev na pasta api)"
    );
    console.log("   2. Confirme se a porta 3000 está disponível");
    console.log(
      "   3. Teste o acesso direto: http://localhost:3000/api/health"
    );
  }
}

if (require.main === module) {
  runTest();
}

module.exports = { testApiSimple, runTest };
