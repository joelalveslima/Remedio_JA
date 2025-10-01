/**
 * Servidor principal da API do Remédio JÁ
 *
 * API para gerenciamento de unidades de saúde, medicamentos e consultas
 * de disponibilidade para o aplicativo Remédio JÁ.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Importar rotas
const healthRoutes = require("./routes/health");
const unitsRoutes = require("./routes/units");
const medicinesRoutes = require("./routes/medicines");
const searchRoutes = require("./routes/search");
const authRoutes = require("./routes/auth");

// Importar middlewares
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Importar configurações
const { swaggerSpec, swaggerUi } = require("./config/swagger");
const database = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: NODE_ENV === "production" ? 100 : 1000, // limite de requests por IP
  message: {
    error: "Muitas requisições do mesmo IP, tente novamente em 15 minutos.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares de segurança e configuração
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(limiter);

// CORS configurado para o app móvel
app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? ["https://seudominio.com", "https://app.seudominio.com"]
        : [
            "http://localhost:8081",
            "http://localhost:19006",
            "exp://localhost:19000",
          ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// Logging
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// Parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Documentação da API com Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use("/api/health", healthRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);

// Rota raiz com informações da API
app.get("/", (req, res) => {
  res.json({
    message: "API do Remédio JÁ",
    version: "1.0.0",
    description: "API para gerenciamento de unidades de saúde e medicamentos",
    endpoints: {
      docs: "/api-docs",
      health: "/api/health",
      units: "/api/units",
      medicines: "/api/medicines",
      search: "/api/search",
      auth: "/api/auth",
    },
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar banco de dados e servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await database.connect();
    console.log("📊 Banco de dados conectado com sucesso");

    // Sincronizar modelos (apenas em desenvolvimento)
    if (NODE_ENV === "development") {
      await database.sync();
      console.log("🔄 Modelos sincronizados com o banco de dados");
    }

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(
        `📚 Documentação disponível em http://localhost:${PORT}/api-docs`
      );
      console.log(`🌍 Ambiente: ${NODE_ENV}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 Recebido SIGTERM, encerrando servidor...");
      server.close(async () => {
        await database.close();
        console.log("✅ Servidor encerrado graciosamente");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("🛑 Recebido SIGINT, encerrando servidor...");
      server.close(async () => {
        await database.close();
        console.log("✅ Servidor encerrado graciosamente");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Iniciar servidor apenas se não estiver sendo importado
if (require.main === module) {
  startServer();
}

module.exports = app;
