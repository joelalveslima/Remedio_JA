/**
 * Script de migração/criação do banco de dados
 */

require("dotenv").config();
const { sequelize } = require("../models");

async function migrate() {
  try {
    console.log("🔄 Iniciando migração do banco de dados...");

    // Forçar recriação das tabelas (apenas desenvolvimento)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ force: true });
      console.log("✅ Tabelas recriadas com sucesso");
    } else {
      await sequelize.sync();
      console.log("✅ Sincronização completa");
    }

    console.log("🎉 Migração concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;
