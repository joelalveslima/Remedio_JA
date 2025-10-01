/**
 * Rotas de Medicamentos
 */

const express = require("express");
const { query, param } = require("express-validator");
const { Medicine, Availability, HealthUnit } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Listar medicamentos
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: sus
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas medicamentos do SUS
 *     responses:
 *       200:
 *         description: Lista de medicamentos
 */
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Página deve ser um número positivo"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve estar entre 1 e 100"),
  ],
  async (req, res) => {
    try {
      const { page = 1, limit = 20, categoria, sus } = req.query;

      const offset = (page - 1) * limit;
      const where = { ativo: true };

      if (categoria) {
        where.categoria = categoria;
      }

      if (sus === "true") {
        where.disponibilidadeSus = true;
      }

      const result = await Medicine.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [
          ["popularidade", "DESC"],
          ["nome", "ASC"],
        ],
      });

      res.json({
        success: true,
        data: result.rows,
        meta: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit),
        },
      });
    } catch (error) {
      console.error("Erro ao listar medicamentos:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Buscar medicamento por ID
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes do medicamento
 *       404:
 *         description: Medicamento não encontrado
 */
router.get(
  "/:id",
  [param("id").isUUID().withMessage("ID deve ser um UUID válido")],
  async (req, res) => {
    try {
      const { id } = req.params;

      const medicine = await Medicine.findByPk(id, {
        include: [
          {
            model: Availability,
            as: "availabilities",
            where: { disponivel: true },
            required: false,
            include: [
              {
                model: HealthUnit,
                as: "HealthUnit",
                where: { ativo: true },
              },
            ],
          },
        ],
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicamento não encontrado",
        });
      }

      // Incrementar popularidade
      await medicine.incrementarPopularidade();

      res.json({
        success: true,
        data: {
          ...medicine.toJSON(),
          unidadesDisponiveis: medicine.availabilities?.length || 0,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar medicamento:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /api/medicines/categories:
 *   get:
 *     summary: Listar categorias de medicamentos
 *     tags: [Medicamentos]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Medicine.findAll({
      attributes: ["categoria"],
      where: { ativo: true },
      group: ["categoria"],
      order: [["categoria", "ASC"]],
    });

    res.json({
      success: true,
      data: categories.map((cat) => cat.categoria),
    });
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

module.exports = router;
