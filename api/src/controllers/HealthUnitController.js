/**
 * Controlador para Unidades de Saúde
 */

const { HealthUnit, Medicine, Availability } = require("../models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

class HealthUnitController {
  // Listar todas as unidades com filtros
  async index(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        cidade,
        estado,
        tipo,
        ativo = true,
        lat,
        lng,
        raio = 10,
      } = req.query;

      const offset = (page - 1) * limit;
      const where = { ativo };

      // Filtros opcionais
      if (cidade) where.cidade = { [Op.iLike]: `%${cidade}%` };
      if (estado) where.estado = estado;
      if (tipo) where.tipo = tipo;

      let units;
      let total;

      // Se coordenadas fornecidas, buscar por proximidade
      if (lat && lng) {
        units = await HealthUnit.buscarPorProximidade(
          parseFloat(lat),
          parseFloat(lng),
          parseFloat(raio),
          parseInt(limit)
        );
        total = units.length;
      } else {
        // Busca padrão
        const result = await HealthUnit.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset,
          order: [["nome", "ASC"]],
          include: [
            {
              model: Availability,
              as: "availabilities",
              where: { disponivel: true },
              required: false,
              include: [
                {
                  model: Medicine,
                  as: "Medicine",
                  attributes: ["nome", "categoria"],
                },
              ],
            },
          ],
        });

        units = result.rows;
        total = result.count;
      }

      // Adicionar informações calculadas
      const unitsWithInfo = units.map((unit) => {
        const unitData = unit.toJSON ? unit.toJSON() : unit;
        return {
          ...unitData,
          totalMedicamentos: unitData.availabilities?.length || 0,
          estaAberto: unit.estaAberto ? unit.estaAberto() : null,
          distancia: unitData.distancia || null,
        };
      });

      res.json({
        success: true,
        data: unitsWithInfo,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Erro ao listar unidades:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Buscar unidade por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const unit = await HealthUnit.findByPk(id, {
        include: [
          {
            model: Availability,
            as: "availabilities",
            include: [
              {
                model: Medicine,
                as: "Medicine",
              },
            ],
          },
        ],
      });

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unidade de saúde não encontrada",
        });
      }

      // Incrementar popularidade
      unit.popularidade += 1;
      await unit.save();

      const unitData = unit.toJSON();

      res.json({
        success: true,
        data: {
          ...unitData,
          estaAberto: unit.estaAberto(),
          totalMedicamentos: unitData.availabilities?.length || 0,
          medicamentosDisponiveis:
            unitData.availabilities?.filter((a) => a.disponivel).length || 0,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar unidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Buscar medicamentos disponíveis em uma unidade
  async medicines(req, res) {
    try {
      const { id } = req.params;
      const { disponivel = true, page = 1, limit = 50 } = req.query;

      const unit = await HealthUnit.findByPk(id);
      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unidade de saúde não encontrada",
        });
      }

      const offset = (page - 1) * limit;
      const where = { healthUnitId: id, ativo: true };

      if (disponivel === "true") {
        where.disponivel = true;
      }

      const result = await Availability.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        include: [
          {
            model: Medicine,
            as: "Medicine",
            where: { ativo: true },
          },
        ],
        order: [
          ["disponivel", "DESC"],
          ["dataUltimaVerificacao", "DESC"],
        ],
      });

      res.json({
        success: true,
        data: result.rows.map((availability) => ({
          id: availability.id,
          disponivel: availability.disponivel,
          quantidade: availability.quantidade,
          unidadeMedida: availability.unidadeMedida,
          dataUltimaVerificacao: availability.dataUltimaVerificacao,
          confiabilidade: availability.confiabilidade,
          medicamento: availability.Medicine,
        })),
        meta: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar medicamentos da unidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Buscar unidades próximas
  async nearby(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { lat, lng, raio = 10, limit = 20 } = req.query;

      const units = await HealthUnit.buscarPorProximidade(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(raio),
        parseInt(limit)
      );

      const unitsWithInfo = await Promise.all(
        units.map(async (unit) => {
          const medicamentosDisponiveis = await Availability.count({
            where: {
              healthUnitId: unit.id,
              disponivel: true,
              ativo: true,
            },
          });

          return {
            ...unit.toJSON(),
            distancia: unit.distancia,
            estaAberto: unit.estaAberto(),
            medicamentosDisponiveis,
          };
        })
      );

      res.json({
        success: true,
        data: unitsWithInfo,
        meta: {
          total: units.length,
          raio: parseFloat(raio),
          coordenadas: { lat: parseFloat(lat), lng: parseFloat(lng) },
        },
      });
    } catch (error) {
      console.error("Erro ao buscar unidades próximas:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Criar nova unidade (admin)
  async store(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const unit = await HealthUnit.create(req.body);

      res.status(201).json({
        success: true,
        message: "Unidade de saúde criada com sucesso",
        data: unit,
      });
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Atualizar unidade (admin)
  async update(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const unit = await HealthUnit.findByPk(id);
      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unidade de saúde não encontrada",
        });
      }

      await unit.update(req.body);

      res.json({
        success: true,
        message: "Unidade de saúde atualizada com sucesso",
        data: unit,
      });
    } catch (error) {
      console.error("Erro ao atualizar unidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Deletar unidade (soft delete)
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const unit = await HealthUnit.findByPk(id);
      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unidade de saúde não encontrada",
        });
      }

      await unit.destroy();

      res.json({
        success: true,
        message: "Unidade de saúde removida com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar unidade:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new HealthUnitController();
