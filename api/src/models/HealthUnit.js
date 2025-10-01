/**
 * Modelo de Unidade de Saúde
 *
 * Define a estrutura das unidades de saúde no banco de dados
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const HealthUnit = sequelize.define(
  "HealthUnit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    // Informações básicas
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255],
      },
    },

    tipo: {
      type: DataTypes.ENUM(
        "UBS",
        "Hospital",
        "Clínica",
        "Farmácia Popular",
        "Pronto Socorro"
      ),
      allowNull: false,
      defaultValue: "UBS",
    },

    // Localização
    endereco: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Rio Branco",
    },

    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "AC",
    },

    cep: {
      type: DataTypes.STRING(9),
      validate: {
        is: /^\d{5}-?\d{3}$/,
      },
    },

    // Coordenadas geográficas
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },

    // Contato
    telefone: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      },
    },

    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true,
      },
    },

    // Horário de funcionamento
    horarioFuncionamento: {
      type: DataTypes.JSON,
      defaultValue: {
        semana: { inicio: "07:00", fim: "17:00" },
        sabado: { inicio: "07:00", fim: "12:00" },
        domingo: { fechado: true },
      },
    },

    // Status e metadados
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica se a unidade foi verificada pela equipe",
    },

    // Serviços disponíveis
    servicos: {
      type: DataTypes.JSON,
      defaultValue: {
        farmacia: true,
        consultaMedica: false,
        vacinacao: false,
        exames: false,
        urgencia: false,
      },
    },

    // Informações adicionais
    observacoes: {
      type: DataTypes.TEXT,
    },

    // Dados para cálculo de distância (cache)
    popularidade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Número de vezes que foi consultada",
    },

    ultimaAtualizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Configurações do modelo
    tableName: "health_units",
    timestamps: true,
    paranoid: true, // Soft delete

    indexes: [
      {
        fields: ["latitude", "longitude"],
        name: "idx_location",
      },
      {
        fields: ["cidade", "estado"],
        name: "idx_city_state",
      },
      {
        fields: ["tipo"],
        name: "idx_type",
      },
      {
        fields: ["ativo"],
        name: "idx_unit_active",
      },
    ],

    // Hooks
    hooks: {
      beforeUpdate: (unit) => {
        unit.ultimaAtualizacao = new Date();
      },
    },
  }
);

// Métodos de instância
HealthUnit.prototype.calcularDistancia = function (lat, lng) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat - this.latitude) * Math.PI) / 180;
  const dLon = ((lng - this.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((this.latitude * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

HealthUnit.prototype.estaAberto = function () {
  const agora = new Date();
  const hora = agora.getHours() * 100 + agora.getMinutes();
  const diaSemana = agora.getDay();

  let horario;
  if (diaSemana === 0) {
    // Domingo
    horario = this.horarioFuncionamento.domingo;
  } else if (diaSemana === 6) {
    // Sábado
    horario = this.horarioFuncionamento.sabado;
  } else {
    // Segunda a sexta
    horario = this.horarioFuncionamento.semana;
  }

  if (horario.fechado) return false;

  const [inicioH, inicioM] = horario.inicio.split(":").map(Number);
  const [fimH, fimM] = horario.fim.split(":").map(Number);
  const inicio = inicioH * 100 + inicioM;
  const fim = fimH * 100 + fimM;

  return hora >= inicio && hora <= fim;
};

// Métodos estáticos
HealthUnit.buscarPorProximidade = async function (
  lat,
  lng,
  raio = 10,
  limite = 20
) {
  const sql = `
    SELECT *, 
    (6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * 
    cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * 
    sin(radians(latitude)))) AS distancia
    FROM health_units 
    WHERE ativo = true 
    AND (6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * 
    cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * 
    sin(radians(latitude)))) <= :raio
    ORDER BY distancia ASC
    LIMIT :limite
  `;

  return await sequelize.query(sql, {
    replacements: { lat, lng, raio, limite },
    type: sequelize.QueryTypes.SELECT,
    model: HealthUnit,
    mapToModel: true,
  });
};

module.exports = HealthUnit;
