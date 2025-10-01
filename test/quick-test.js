/**
 * Versão simplificada do teste sem dependências externas
 */

const http = require("http");

async function quickTest() {
  console.log("🧪 Teste rápido de conectividade...\n");

  // Teste 1: Ping simples
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/",
    method: "GET",
    timeout: 3000,
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("✅ Conexão básica OK!");
        console.log(`Status: ${res.statusCode}`);

        // Teste 2: Health endpoint
        testHealth();
      });
    });

    req.on("error", (error) => {
      console.log("❌ Erro na conexão básica:", error.code);
      console.log("💡 Verifique se a API está rodando em outro terminal");
    });

    req.setTimeout(3000);
    req.end();
  });
}

function testHealth() {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/health",
    method: "GET",
    timeout: 3000,
  };

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log("✅ Health check OK!");
        console.log(`API Status: ${result.status}`);
        console.log(`Unidades: ${result.statistics?.unidades || "N/A"}`);
      } catch (error) {
        console.log("⚠️ Health check com resposta inválida");
      }
    });
  });

  req.on("error", (error) => {
    console.log("❌ Erro no health check:", error.code);
  });

  req.setTimeout(3000);
  req.end();
}

quickTest();
