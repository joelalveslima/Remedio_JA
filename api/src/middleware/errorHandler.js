/**
 * Middleware de tratamento de erros
 */

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Erro de validação do Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Dados inválidos",
      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message,
        value: error.value,
      })),
    });
  }

  // Erro de constraint única do Sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Recurso já existe",
      field: err.errors[0]?.path,
      value: err.errors[0]?.value,
    });
  }

  // Erro de foreign key do Sequelize
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Referência inválida",
      table: err.table,
      field: err.fields,
    });
  }

  // Erro de conexão com banco
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      success: false,
      message: "Erro de conexão com banco de dados",
    });
  }

  // Erro de JSON malformado
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "JSON malformado",
      details: "Verifique a sintaxe do JSON enviado",
    });
  }

  // Erro de payload muito grande
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Payload muito grande",
      limit: "10MB",
    });
  }

  // Erro de timeout
  if (err.code === "ETIMEOUT" || err.timeout) {
    return res.status(408).json({
      success: false,
      message: "Timeout da requisição",
    });
  }

  // Erro de rate limit
  if (err.statusCode === 429) {
    return res.status(429).json({
      success: false,
      message: "Muitas requisições",
      retryAfter: err.headers["retry-after"],
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expirado",
    });
  }

  // Erro genérico
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? "Erro interno do servidor" : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.details,
    }),
  });
};

module.exports = errorHandler;
