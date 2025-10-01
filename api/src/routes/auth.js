/**
 * Rotas de Autenticação (placeholder)
 */

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (placeholder)
 *     tags: [Autenticação]
 *     responses:
 *       501:
 *         description: Não implementado ainda
 */
router.post("/login", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Autenticação não implementada ainda",
    note: "Para usar endpoints administrativos, implemente JWT authentication",
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro (placeholder)
 *     tags: [Autenticação]
 *     responses:
 *       501:
 *         description: Não implementado ainda
 */
router.post("/register", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Registro não implementado ainda",
  });
});

module.exports = router;
