const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "Teste simples funcionando!" });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor de teste rodando em http://0.0.0.0:${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/test`);
});
