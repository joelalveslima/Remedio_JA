/**
 * Rotas de Unidades de Saúde
 */

const express = require("express");
const { query, param, body } = require("express-validator");
const HealthUnitController = require("../controllers/HealthUnitController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthUnit:
 *       type: object
 *       required:
 *         - nome
 *         - endereco
 *         - latitude
 *         - longitude
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         tipo:
 *           type: string
 *           enum: [UBS, Hospital, Clínica, Farmácia Popular, Pronto Socorro]
 *         endereco:
 *           type: string
 *         bairro:
 *           type: string
 *         cidade:
 *           type: string
 *         estado:
 *           type: string
 *           maxLength: 2
 *         cep:
 *           type: string
 *           pattern: '^\d{5}-?\d{3}$'
 *         latitude:
 *           type: number
 *           format: float
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           format: float
 *           minimum: -180
 *           maximum: 180
 *         telefone:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         horarioFuncionamento:
 *           type: object
 *         ativo:
 *           type: boolean
 */

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Listar unidades de saúde
 *     tags: [Unidades]
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
 *         name: cidade
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *       - in: query
 *         name: raio
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de unidades de saúde
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
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude inválida"),
    query("lng")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude inválida"),
    query("raio")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Raio deve estar entre 1 e 100 km"),
  ],
  HealthUnitController.index
);

/**
 * @swagger
 * /api/units/nearby:
 *   get:
 *     summary: Buscar unidades próximas
 *     tags: [Unidades]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: raio
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Unidades próximas
 */
router.get(
  "/nearby",
  [
    query("lat")
      .notEmpty()
      .withMessage("Latitude é obrigatória")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude inválida"),
    query("lng")
      .notEmpty()
      .withMessage("Longitude é obrigatória")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude inválida"),
    query("raio")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage("Raio deve estar entre 1 e 100 km"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve estar entre 1 e 100"),
  ],
  HealthUnitController.nearby
);

/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: Buscar unidade por ID
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes da unidade
 *       404:
 *         description: Unidade não encontrada
 */
router.get(
  "/:id",
  [param("id").isUUID().withMessage("ID deve ser um UUID válido")],
  HealthUnitController.show
);

/**
 * @swagger
 * /api/units/{id}/medicines:
 *   get:
 *     summary: Listar medicamentos de uma unidade
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: disponivel
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Lista de medicamentos da unidade
 *       404:
 *         description: Unidade não encontrada
 */
router.get(
  "/:id/medicines",
  [
    param("id").isUUID().withMessage("ID deve ser um UUID válido"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Página deve ser um número positivo"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limite deve estar entre 1 e 100"),
  ],
  HealthUnitController.medicines
);

/**
 * @swagger
 * /api/units:
 *   post:
 *     summary: Criar nova unidade (admin)
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthUnit'
 *     responses:
 *       201:
 *         description: Unidade criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post(
  "/",
  [
    body("nome")
      .notEmpty()
      .withMessage("Nome é obrigatório")
      .isLength({ min: 2, max: 255 })
      .withMessage("Nome deve ter entre 2 e 255 caracteres"),
    body("endereco").notEmpty().withMessage("Endereço é obrigatório"),
    body("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude deve estar entre -90 e 90"),
    body("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude deve estar entre -180 e 180"),
    body("telefone")
      .optional()
      .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
      .withMessage("Telefone deve estar no formato (xx) xxxxx-xxxx"),
    body("email").optional().isEmail().withMessage("Email deve ser válido"),
    body("cep")
      .optional()
      .matches(/^\d{5}-?\d{3}$/)
      .withMessage("CEP deve estar no formato xxxxx-xxx"),
  ],
  HealthUnitController.store
);

/**
 * @swagger
 * /api/units/{id}:
 *   put:
 *     summary: Atualizar unidade (admin)
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthUnit'
 *     responses:
 *       200:
 *         description: Unidade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Unidade não encontrada
 */
router.put(
  "/:id",
  [
    param("id").isUUID().withMessage("ID deve ser um UUID válido"),
    body("nome")
      .optional()
      .isLength({ min: 2, max: 255 })
      .withMessage("Nome deve ter entre 2 e 255 caracteres"),
    body("latitude")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude deve estar entre -90 e 90"),
    body("longitude")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude deve estar entre -180 e 180"),
  ],
  HealthUnitController.update
);

/**
 * @swagger
 * /api/units/{id}:
 *   delete:
 *     summary: Deletar unidade (admin)
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Unidade removida com sucesso
 *       404:
 *         description: Unidade não encontrada
 */
router.delete(
  "/:id",
  [param("id").isUUID().withMessage("ID deve ser um UUID válido")],
  HealthUnitController.destroy
);

module.exports = router;
