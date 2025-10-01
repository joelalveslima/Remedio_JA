/**
 * Rotas de Busca
 *
 * Endpoints principais para busca de medicamentos e unidades
 */

const express = require("express");
const { query } = require("express-validator");
const SearchController = require("../controllers/SearchController");

const router = express.Router();

/**
 * @swagger
 * /api/search/medicine:
 *   get:
 *     summary: Buscar medicamento e unidades que têm disponível
 *     tags: [Busca]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Termo de busca para o medicamento
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude para busca por proximidade
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude para busca por proximidade
 *       - in: query
 *         name: raio
 *         schema:
 *           type: number
 *           default: 50
 *         description: Raio de busca em km
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Limite de resultados por medicamento
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 */
router.get(
  "/medicine",
  [
    query("q")
      .notEmpty()
      .withMessage("Termo de busca é obrigatório")
      .isLength({ min: 2 })
      .withMessage("Termo deve ter pelo menos 2 caracteres"),
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude deve estar entre -90 e 90"),
    query("lng")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude deve estar entre -180 e 180"),
    query("raio")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Raio deve estar entre 1 e 100 km"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve estar entre 1 e 100"),
  ],
  SearchController.searchMedicine
);

/**
 * @swagger
 * /api/search/nearby:
 *   get:
 *     summary: Buscar unidades próximas com medicamentos específicos
 *     tags: [Busca]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude
 *       - in: query
 *         name: raio
 *         schema:
 *           type: number
 *           default: 10
 *         description: Raio de busca em km
 *       - in: query
 *         name: medicamentos
 *         schema:
 *           type: string
 *         description: Lista de medicamentos separados por vírgula
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Limite de resultados
 *     responses:
 *       200:
 *         description: Unidades próximas encontradas
 */
router.get(
  "/nearby",
  [
    query("lat")
      .notEmpty()
      .withMessage("Latitude é obrigatória")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude deve estar entre -90 e 90"),
    query("lng")
      .notEmpty()
      .withMessage("Longitude é obrigatória")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude deve estar entre -180 e 180"),
    query("raio")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Raio deve estar entre 1 e 100 km"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve estar entre 1 e 100"),
  ],
  SearchController.searchNearbyUnits
);

/**
 * @swagger
 * /api/search/autocomplete:
 *   get:
 *     summary: Autocomplete para nomes de medicamentos
 *     tags: [Busca]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Texto para autocomplete
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de sugestões
 *     responses:
 *       200:
 *         description: Sugestões de medicamentos
 */
router.get(
  "/autocomplete",
  [
    query("q")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Texto deve ter pelo menos 2 caracteres"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limite deve estar entre 1 e 50"),
  ],
  SearchController.autocomplete
);

module.exports = router;
