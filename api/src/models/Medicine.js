/**
 * Modelo de Medicamento
 *
 * Define a estrutura dos medicamentos no banco de dados
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const Medicine = sequelize.define(
  "Medicine",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    // Informações básicas do medicamento
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255],
      },
    },

    nomeGenerico: {
      type: DataTypes.STRING(255),
      comment: "Nome do princípio ativo",
    },

    nomeComercial: {
      type: DataTypes.STRING(255),
      comment: "Nome comercial/marca",
    },

    // Classificação
    categoria: {
      type: DataTypes.ENUM(
        "Analgésico",
        "Antibiótico",
        "Anti-inflamatório",
        "Antidepressivo",
        "Antihistamínico",
        "Antihipertensivo",
        "Antidiabético",
        "Vitamina",
        "Suplemento",
        "Outros"
      ),
      allowNull: false,
      defaultValue: "Outros",
    },

    classe: {
      type: DataTypes.STRING(100),
      comment: "Classe terapêutica (ex: AINE, Betabloqueador)",
    },

    // Apresentação
    apresentacao: {
      type: DataTypes.STRING(100),
      comment: "Ex: Comprimido 500mg, Xarope 100ml",
    },

    dosagem: {
      type: DataTypes.STRING(50),
      comment: "Ex: 500mg, 20mg/ml",
    },

    formaFarmaceutica: {
      type: DataTypes.ENUM(
        "Comprimido",
        "Cápsula",
        "Xarope",
        "Solução",
        "Suspensão",
        "Pomada",
        "Creme",
        "Gel",
        "Injeção",
        "Supositório",
        "Outros"
      ),
      allowNull: false,
      defaultValue: "Comprimido",
    },

    // Identificação
    codigoBarras: {
      type: DataTypes.STRING(50),
      unique: true,
    },

    registroAnvisa: {
      type: DataTypes.STRING(30),
      comment: "Número de registro na ANVISA",
    },

    // Classificação regulatória
    necessitaReceita: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    tipoReceita: {
      type: DataTypes.ENUM(
        "Simples",
        "Especial",
        "Controlada",
        "Não necessita"
      ),
      defaultValue: "Não necessita",
    },

    // Informações adicionais
    fabricante: {
      type: DataTypes.STRING(100),
    },

    laboratorio: {
      type: DataTypes.STRING(100),
    },

    // SUS
    disponibilidadeSus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Disponível na rede pública",
    },

    farmaciaPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Disponível no Farmácia Popular",
    },

    // Metadados para busca
    palavrasChave: {
      type: DataTypes.TEXT,
      comment: "Palavras-chave para facilitar busca",
    },

    sinonimos: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Lista de sinônimos e nomes alternativos",
    },

    // Status
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Verificado pela equipe técnica",
    },

    // Estatísticas
    popularidade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Número de vezes pesquisado",
    },

    ultimaAtualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Configurações do modelo
    tableName: "medicines",
    timestamps: true,
    paranoid: true, // Soft delete

    indexes: [
      {
        fields: ["nome"],
        name: "idx_medicine_name",
      },
      {
        fields: ["nomeGenerico"],
        name: "idx_generic_name",
      },
      {
        fields: ["categoria"],
        name: "idx_category",
      },
      {
        fields: ["disponibilidadeSus"],
        name: "idx_sus_availability",
      },
      {
        fields: ["farmaciaPopular"],
        name: "idx_farmacia_popular",
      },
      {
        fields: ["ativo"],
        name: "idx_medicine_active",
      },
      {
        // Índice composto para busca completa
        fields: ["nome", "nomeGenerico", "categoria"],
        name: "idx_full_search",
      },
    ],

    // Hooks
    hooks: {
      beforeCreate: (medicine) => {
        // Normalizar nome para busca
        medicine.palavrasChave = [
          medicine.nome,
          medicine.nomeGenerico,
          medicine.nomeComercial,
          ...(medicine.sinonimos || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
      },

      beforeUpdate: (medicine) => {
        medicine.ultimaAtualizacao = new Date();

        // Atualizar palavras-chave se necessário
        if (
          medicine.changed("nome") ||
          medicine.changed("nomeGenerico") ||
          medicine.changed("nomeComercial") ||
          medicine.changed("sinonimos")
        ) {
          medicine.palavrasChave = [
            medicine.nome,
            medicine.nomeGenerico,
            medicine.nomeComercial,
            ...(medicine.sinonimos || []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        }
      },
    },
  }
);

// Métodos de instância
Medicine.prototype.adicionarSinonimo = function (sinonimo) {
  if (!this.sinonimos) this.sinonimos = [];
  if (!this.sinonimos.includes(sinonimo)) {
    this.sinonimos.push(sinonimo);
  }
};

Medicine.prototype.incrementarPopularidade = async function () {
  this.popularidade += 1;
  await this.save();
};

// Métodos estáticos
Medicine.buscarPorTexto = async function (texto, limite = 20) {
  const textoLimpo = texto.toLowerCase().trim();

  return await Medicine.findAll({
    where: {
      ativo: true,
      [sequelize.Op.or]: [
        { nome: { [sequelize.Op.iLike]: `%${textoLimpo}%` } },
        { nomeGenerico: { [sequelize.Op.iLike]: `%${textoLimpo}%` } },
        { nomeComercial: { [sequelize.Op.iLike]: `%${textoLimpo}%` } },
        { palavrasChave: { [sequelize.Op.iLike]: `%${textoLimpo}%` } },
      ],
    },
    order: [
      ["popularidade", "DESC"],
      ["nome", "ASC"],
    ],
    limit: limite,
  });
};

Medicine.buscarPorCategoria = async function (categoria, limite = 50) {
  return await Medicine.findAll({
    where: {
      ativo: true,
      categoria: categoria,
    },
    order: [
      ["popularidade", "DESC"],
      ["nome", "ASC"],
    ],
    limit: limite,
  });
};

Medicine.buscarDisponiveisSus = async function (limite = 100) {
  return await Medicine.findAll({
    where: {
      ativo: true,
      disponibilidadeSus: true,
    },
    order: [
      ["categoria", "ASC"],
      ["nome", "ASC"],
    ],
    limit: limite,
  });
};

module.exports = Medicine;
