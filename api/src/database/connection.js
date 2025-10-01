/**
 * Configuração e conexão com banco de dados
 *
 * Suporta SQLite para desenvolvimento e PostgreSQL para produção
 */

const { Sequelize } = require("sequelize");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";

let sequelize;

// Configuração baseada no ambiente
if (NODE_ENV === "production") {
  // PostgreSQL para produção
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false, // Desabilitar logs em produção
    dialectOptions: {
      ssl:
        process.env.DATABASE_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // SQLite para desenvolvimento
  const dbPath = path.join(
    __dirname,
    "..",
    "..",
    "database",
    "remedio_ja.sqlite"
  );

  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

// Função para conectar ao banco
async function connect() {
  try {
    await sequelize.authenticate();
    console.log(
      `✅ Conexão com banco de dados estabelecida (${sequelize.getDialect()})`
    );
    return sequelize;
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error);
    throw error;
  }
}

// Função para sincronizar modelos
async function sync(force = false) {
  try {
    await sequelize.sync({ force });
    console.log("🔄 Modelos sincronizados com banco de dados");
  } catch (error) {
    console.error("❌ Erro ao sincronizar modelos:", error);
    throw error;
  }
}

// Função para fechar conexão
async function close() {
  try {
    await sequelize.close();
    console.log("📴 Conexão com banco de dados fechada");
  } catch (error) {
    console.error("❌ Erro ao fechar conexão:", error);
    throw error;
  }
}

// Função para testar conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    return { status: "connected", dialect: sequelize.getDialect() };
  } catch (error) {
    return { status: "disconnected", error: error.message };
  }
}

module.exports = {
  sequelize,
  connect,
  sync,
  close,
  testConnection,
};
