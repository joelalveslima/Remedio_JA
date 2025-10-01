/**
 * Middleware para rotas não encontradas
 */

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint não encontrado",
    path: req.originalUrl,
    method: req.method,
    suggestion: "Verifique a documentação em /api-docs",
  });
};

module.exports = notFound;
