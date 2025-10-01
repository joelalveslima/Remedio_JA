/**
 * Rotas de Health Check
 */

const express = require("express");
const { testConnection } = require("../database/connection");
const { HealthUnit, Medicine, Availability } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Status da API e banco de dados
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Status da aplicação
 */
router.get("/", async (req, res) => {
  try {
    const startTime = Date.now();

    // Testar conexão com banco
    const dbStatus = await testConnection();

    // Obter estatísticas básicas
    const stats = {
      unidades: await HealthUnit.count({ where: { ativo: true } }),
      medicamentos: await Medicine.count({ where: { ativo: true } }),
      disponibilidades: await Availability.count({ where: { ativo: true } }),
    };

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: dbStatus,
      statistics: stats,
      responseTime: `${responseTime}ms`,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: "MB",
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(503).json({
      status: "error",
      message: "Serviço indisponível",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @swagger
 * /api/health/database:
 *   get:
 *     summary: Status detalhado do banco de dados
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Status do banco de dados
 */
router.get("/database", async (req, res) => {
  try {
    const dbStatus = await testConnection();

    if (dbStatus.status === "connected") {
      // Testar operações básicas
      const testQueries = await Promise.all([
        HealthUnit.count(),
        Medicine.count(),
        Availability.count(),
      ]);

      res.json({
        database: dbStatus,
        operations: {
          healthUnits: testQueries[0],
          medicines: testQueries[1],
          availabilities: testQueries[2],
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        database: dbStatus,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      database: { status: "error", error: error.message },
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
