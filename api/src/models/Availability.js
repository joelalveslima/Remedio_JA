/**
 * Modelo de Disponibilidade
 *
 * Define a relação entre unidades de saúde e medicamentos disponíveis
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const Availability = sequelize.define(
  "Availability",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    // Chaves estrangeiras
    healthUnitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "health_units",
        key: "id",
      },
    },

    medicineId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "medicines",
        key: "id",
      },
    },

    // Status de disponibilidade
    disponivel: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    quantidade: {
      type: DataTypes.INTEGER,
      comment: "Quantidade em estoque (quando disponível)",
    },

    unidadeMedida: {
      type: DataTypes.ENUM("Unidade", "Caixa", "Frasco", "Bisnaga", "Ampola"),
      defaultValue: "Unidade",
    },

    // Informações temporais
    dataUltimaVerificacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },

    dataExpiracao: {
      type: DataTypes.DATEONLY,
      comment: "Data de validade do lote",
    },

    previsaoReposicao: {
      type: DataTypes.DATEONLY,
      comment: "Previsão de quando o medicamento estará disponível novamente",
    },

    // Metadados
    fonteDado: {
      type: DataTypes.ENUM("Manual", "Sistema", "API", "Usuario"),
      defaultValue: "Manual",
      comment: "Origem da informação de disponibilidade",
    },

    confiabilidade: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: {
        min: 0,
        max: 100,
      },
      comment: "Nível de confiabilidade da informação (0-100)",
    },

    // Observações
    observacoes: {
      type: DataTypes.TEXT,
      comment: "Observações adicionais sobre a disponibilidade",
    },

    // Controle de qualidade
    verificadoPor: {
      type: DataTypes.STRING(100),
      comment: "Usuário/sistema que verificou a informação",
    },

    numeroVerificacoes: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "Número de vezes que a disponibilidade foi verificada",
    },

    // Status temporal
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Configurações do modelo
    tableName: "medicine_availability",
    timestamps: true,
    paranoid: true, // Soft delete

    indexes: [
      {
        fields: ["healthUnitId", "medicineId"],
        unique: true,
        name: "idx_unit_medicine_unique",
      },
      {
        fields: ["disponivel"],
        name: "idx_available",
      },
      {
        fields: ["dataUltimaVerificacao"],
        name: "idx_last_check",
      },
      {
        fields: ["healthUnitId"],
        name: "idx_health_unit",
      },
      {
        fields: ["medicineId"],
        name: "idx_medicine",
      },
      {
        fields: ["confiabilidade"],
        name: "idx_reliability",
      },
    ],

    // Hooks
    hooks: {
      beforeUpdate: (availability) => {
        availability.dataUltimaVerificacao = new Date();
        availability.numeroVerificacoes += 1;
      },
    },
  }
);

// Métodos de instância
Availability.prototype.isRecente = function (horas = 24) {
  const agora = new Date();
  const diff = agora - this.dataUltimaVerificacao;
  const horasDecorridas = diff / (1000 * 60 * 60);
  return horasDecorridas <= horas;
};

Availability.prototype.isConfiavel = function (minimoConfiabilidade = 70) {
  return this.confiabilidade >= minimoConfiabilidade;
};

Availability.prototype.atualizarDisponibilidade = async function (
  novoStatus,
  observacao = null
) {
  this.disponivel = novoStatus;
  this.dataUltimaVerificacao = new Date();

  if (observacao) {
    this.observacoes = observacao;
  }

  // Ajustar confiabilidade baseado na frequência de atualizações
  if (this.numeroVerificacoes > 5) {
    this.confiabilidade = Math.min(100, this.confiabilidade + 5);
  }

  await this.save();
};

// Métodos estáticos
Availability.buscarPorUnidade = async function (
  healthUnitId,
  apenasDisponiveis = false
) {
  const where = {
    healthUnitId,
    ativo: true,
  };

  if (apenasDisponiveis) {
    where.disponivel = true;
  }

  return await Availability.findAll({
    where,
    include: [
      {
        association: "Medicine",
        where: { ativo: true },
      },
    ],
    order: [
      ["disponivel", "DESC"],
      ["dataUltimaVerificacao", "DESC"],
    ],
  });
};

Availability.buscarPorMedicamento = async function (
  medicineId,
  apenasDisponiveis = true
) {
  const where = {
    medicineId,
    ativo: true,
  };

  if (apenasDisponiveis) {
    where.disponivel = true;
  }

  return await Availability.findAll({
    where,
    include: [
      {
        association: "HealthUnit",
        where: { ativo: true },
      },
    ],
    order: [
      ["disponivel", "DESC"],
      ["confiabilidade", "DESC"],
      ["dataUltimaVerificacao", "DESC"],
    ],
  });
};

Availability.buscarDesatualizados = async function (horasLimite = 168) {
  // 7 dias
  const dataLimite = new Date(Date.now() - horasLimite * 60 * 60 * 1000);

  return await Availability.findAll({
    where: {
      ativo: true,
      dataUltimaVerificacao: {
        [sequelize.Op.lt]: dataLimite,
      },
    },
    include: [
      {
        association: "HealthUnit",
        attributes: ["nome"],
      },
      {
        association: "Medicine",
        attributes: ["nome"],
      },
    ],
    order: [["dataUltimaVerificacao", "ASC"]],
  });
};

Availability.estatisticasDisponibilidade = async function () {
  const total = await Availability.count({ where: { ativo: true } });
  const disponiveis = await Availability.count({
    where: { ativo: true, disponivel: true },
  });

  const porUnidade = await sequelize.query(
    `
    SELECT 
      hu.nome as unidade,
      COUNT(*) as total_medicamentos,
      SUM(CASE WHEN ma.disponivel = true THEN 1 ELSE 0 END) as disponiveis,
      ROUND(AVG(ma.confiabilidade), 2) as confiabilidade_media
    FROM medicine_availability ma
    JOIN health_units hu ON ma.healthUnitId = hu.id
    WHERE ma.ativo = true AND hu.ativo = true
    GROUP BY hu.id, hu.nome
    ORDER BY disponiveis DESC
  `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return {
    total,
    disponiveis,
    porcentagemDisponibilidade:
      total > 0 ? ((disponiveis / total) * 100).toFixed(2) : 0,
    porUnidade,
  };
};

module.exports = Availability;
