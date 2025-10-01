/**
 * Controlador de Busca
 *
 * Endpoint principal para buscar medicamentos e unidades disponíveis
 */

const { HealthUnit, Medicine, Availability } = require("../models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

class SearchController {
  // Buscar medicamento e retornar unidades que têm disponível
  async searchMedicine(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Parâmetros de busca inválidos",
          errors: errors.array(),
        });
      }

      const {
        q: query, // termo de busca
        lat,
        lng,
        raio = 50,
        limit = 20,
      } = req.query;

      // 1. Buscar medicamentos que correspondem ao termo
      const medicines = await Medicine.buscarPorTexto(query, 10);

      if (medicines.length === 0) {
        return res.json({
          success: true,
          message: "Nenhum medicamento encontrado",
          data: [],
          suggestions: await this.getSuggestions(query),
        });
      }

      // 2. Para cada medicamento, buscar unidades que têm disponível
      const results = [];

      for (const medicine of medicines) {
        // Incrementar popularidade do medicamento
        await medicine.incrementarPopularidade();

        // Buscar disponibilidades
        let availabilities = await Availability.findAll({
          where: {
            medicineId: medicine.id,
            disponivel: true,
            ativo: true,
          },
          include: [
            {
              model: HealthUnit,
              as: "HealthUnit",
              where: { ativo: true },
            },
          ],
          order: [
            ["confiabilidade", "DESC"],
            ["dataUltimaVerificacao", "DESC"],
          ],
        });

        // Se coordenadas fornecidas, calcular distâncias e filtrar por raio
        if (lat && lng) {
          const userLat = parseFloat(lat);
          const userLng = parseFloat(lng);
          const maxRadius = parseFloat(raio);

          availabilities = availabilities
            .map((availability) => {
              const unit = availability.HealthUnit;
              const distance = unit.calcularDistancia(userLat, userLng);

              return {
                ...availability.toJSON(),
                HealthUnit: {
                  ...unit.toJSON(),
                  distancia: distance,
                  estaAberto: unit.estaAberto(),
                },
              };
            })
            .filter(
              (availability) =>
                parseFloat(availability.HealthUnit.distancia) <= maxRadius
            )
            .sort(
              (a, b) =>
                parseFloat(a.HealthUnit.distancia) -
                parseFloat(b.HealthUnit.distancia)
            )
            .slice(0, parseInt(limit));
        } else {
          // Sem coordenadas, apenas ordenar por confiabilidade
          availabilities = availabilities.slice(0, parseInt(limit));
        }

        if (availabilities.length > 0) {
          results.push({
            medicamento: {
              id: medicine.id,
              nome: medicine.nome,
              nomeGenerico: medicine.nomeGenerico,
              categoria: medicine.categoria,
              apresentacao: medicine.apresentacao,
              necessitaReceita: medicine.necessitaReceita,
              disponibilidadeSus: medicine.disponibilidadeSus,
            },
            unidades: availabilities.map((availability) => ({
              id: availability.HealthUnit.id,
              nome: availability.HealthUnit.nome,
              endereco: availability.HealthUnit.endereco,
              bairro: availability.HealthUnit.bairro,
              telefone: availability.HealthUnit.telefone,
              horarioFuncionamento:
                availability.HealthUnit.horarioFuncionamento,
              latitude: availability.HealthUnit.latitude,
              longitude: availability.HealthUnit.longitude,
              distancia: availability.HealthUnit.distancia || null,
              estaAberto: availability.HealthUnit.estaAberto || null,
              disponibilidade: {
                confiabilidade: availability.confiabilidade,
                dataUltimaVerificacao: availability.dataUltimaVerificacao,
                quantidade: availability.quantidade,
                unidadeMedida: availability.unidadeMedida,
              },
            })),
          });
        }
      }

      // Estatísticas da busca
      const totalUnidades = results.reduce(
        (acc, result) => acc + result.unidades.length,
        0
      );
      const medicamentosEncontrados = results.length;

      res.json({
        success: true,
        data: results,
        meta: {
          termoBusca: query,
          medicamentosEncontrados,
          totalUnidades,
          coordenadas:
            lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
          raio: lat && lng ? parseFloat(raio) : null,
        },
      });
    } catch (error) {
      console.error("Erro na busca de medicamentos:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Buscar unidades próximas com medicamentos específicos
  async searchNearbyUnits(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Coordenadas inválidas",
          errors: errors.array(),
        });
      }

      const { lat, lng, raio = 10, medicamentos = "", limit = 20 } = req.query;

      // Buscar unidades próximas
      const units = await HealthUnit.buscarPorProximidade(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(raio),
        parseInt(limit)
      );

      // Se medicamentos específicos foram solicitados
      let medicineIds = [];
      if (medicamentos) {
        const medicineNames = medicamentos
          .split(",")
          .map((name) => name.trim());
        const medicines = await Medicine.findAll({
          where: {
            ativo: true,
            [Op.or]: medicineNames.map((name) => ({
              [Op.or]: [
                { nome: { [Op.iLike]: `%${name}%` } },
                { nomeGenerico: { [Op.iLike]: `%${name}%` } },
              ],
            })),
          },
        });
        medicineIds = medicines.map((m) => m.id);
      }

      // Enriquecer dados das unidades
      const enrichedUnits = await Promise.all(
        units.map(async (unit) => {
          // Buscar disponibilidades
          const availabilityWhere = {
            healthUnitId: unit.id,
            ativo: true,
          };

          if (medicineIds.length > 0) {
            availabilityWhere.medicineId = { [Op.in]: medicineIds };
            availabilityWhere.disponivel = true;
          }

          const availabilities = await Availability.findAll({
            where: availabilityWhere,
            include: [
              {
                model: Medicine,
                as: "Medicine",
                attributes: ["nome", "categoria", "apresentacao"],
              },
            ],
            order: [
              ["disponivel", "DESC"],
              ["confiabilidade", "DESC"],
            ],
          });

          const medicamentosDisponiveis = availabilities.filter(
            (a) => a.disponivel
          ).length;
          const medicamentosTotal = availabilities.length;

          return {
            id: unit.id,
            nome: unit.nome,
            endereco: unit.endereco,
            bairro: unit.bairro,
            telefone: unit.telefone,
            horarioFuncionamento: unit.horarioFuncionamento,
            latitude: unit.latitude,
            longitude: unit.longitude,
            distancia: unit.distancia,
            estaAberto: unit.estaAberto(),
            medicamentos: {
              total: medicamentosTotal,
              disponiveis: medicamentosDisponiveis,
              lista:
                medicineIds.length > 0
                  ? availabilities.map((a) => ({
                      nome: a.Medicine.nome,
                      categoria: a.Medicine.categoria,
                      disponivel: a.disponivel,
                      confiabilidade: a.confiabilidade,
                    }))
                  : [],
            },
          };
        })
      );

      // Filtrar apenas unidades que têm os medicamentos solicitados
      const filteredUnits =
        medicineIds.length > 0
          ? enrichedUnits.filter((unit) => unit.medicamentos.disponiveis > 0)
          : enrichedUnits;

      res.json({
        success: true,
        data: filteredUnits,
        meta: {
          total: filteredUnits.length,
          coordenadas: { lat: parseFloat(lat), lng: parseFloat(lng) },
          raio: parseFloat(raio),
          medicamentosFiltro: medicamentos ? medicamentos.split(",") : [],
        },
      });
    } catch (error) {
      console.error("Erro na busca de unidades próximas:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Autocomplete para medicamentos
  async autocomplete(req, res) {
    try {
      const { q: query, limit = 10 } = req.query;

      if (!query || query.length < 2) {
        return res.json({
          success: true,
          data: [],
          message: "Digite pelo menos 2 caracteres",
        });
      }

      const medicines = await Medicine.findAll({
        where: {
          ativo: true,
          [Op.or]: [
            { nome: { [Op.iLike]: `%${query}%` } },
            { nomeGenerico: { [Op.iLike]: `%${query}%` } },
            { nomeComercial: { [Op.iLike]: `%${query}%` } },
          ],
        },
        attributes: ["id", "nome", "nomeGenerico", "categoria"],
        order: [
          ["popularidade", "DESC"],
          ["nome", "ASC"],
        ],
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: medicines.map((medicine) => ({
          id: medicine.id,
          nome: medicine.nome,
          nomeGenerico: medicine.nomeGenerico,
          categoria: medicine.categoria,
          label: medicine.nomeGenerico
            ? `${medicine.nome} (${medicine.nomeGenerico})`
            : medicine.nome,
        })),
      });
    } catch (error) {
      console.error("Erro no autocomplete:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Métodos auxiliares
  async getSuggestions(query) {
    try {
      // Buscar medicamentos similares baseado em categorias comuns
      const similarMedicines = await Medicine.findAll({
        where: {
          ativo: true,
          palavrasChave: { [Op.iLike]: `%${query.substring(0, 3)}%` },
        },
        attributes: ["nome", "categoria"],
        order: [["popularidade", "DESC"]],
        limit: 5,
      });

      return similarMedicines.map((m) => m.nome);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      return [];
    }
  }
}

module.exports = new SearchController();
