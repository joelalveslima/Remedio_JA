/**
 * Configuração do Swagger para documentação da API
 */

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Remédio JÁ",
      version: "1.0.0",
      description:
        "API para gerenciamento de unidades de saúde e disponibilidade de medicamentos",
      contact: {
        name: "Joel Alves Lima",
        email: "contato@exemplo.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
      {
        url: "https://api.remedioaja.com",
        description: "Servidor de produção",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKey: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
      responses: {
        BadRequest: {
          description: "Requisição inválida",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string" },
                  errors: { type: "array" },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "Token não fornecido ou inválido",
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: "Recurso não encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "Erro interno do servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Endpoints de status da API",
      },
      {
        name: "Busca",
        description: "Endpoints de busca de medicamentos e unidades",
      },
      {
        name: "Unidades",
        description: "CRUD de unidades de saúde",
      },
      {
        name: "Medicamentos",
        description: "Gerenciamento de medicamentos",
      },
      {
        name: "Autenticação",
        description: "Login e registro de usuários",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

// Customização do Swagger UI
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #009900 }
  `,
  customSiteTitle: "API Remédio JÁ - Documentação",
  customfavIcon: "/favicon.ico",
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions,
};
