/**
 * Centralizador de modelos e definição de relacionamentos
 */

const { sequelize } = require("../database/connection");

// Importar modelos
const HealthUnit = require("./HealthUnit");
const Medicine = require("./Medicine");
const Availability = require("./Availability");

// Definir relacionamentos
// HealthUnit tem muitas disponibilidades
HealthUnit.hasMany(Availability, {
  foreignKey: "healthUnitId",
  as: "availabilities",
});

// Medicine tem muitas disponibilidades
Medicine.hasMany(Availability, {
  foreignKey: "medicineId",
  as: "availabilities",
});

// Availability pertence a uma unidade e um medicamento
Availability.belongsTo(HealthUnit, {
  foreignKey: "healthUnitId",
  as: "HealthUnit",
});

Availability.belongsTo(Medicine, {
  foreignKey: "medicineId",
  as: "Medicine",
});

// Relacionamento many-to-many através de Availability
HealthUnit.belongsToMany(Medicine, {
  through: Availability,
  foreignKey: "healthUnitId",
  otherKey: "medicineId",
  as: "medicines",
});

Medicine.belongsToMany(HealthUnit, {
  through: Availability,
  foreignKey: "medicineId",
  otherKey: "healthUnitId",
  as: "healthUnits",
});

module.exports = {
  sequelize,
  HealthUnit,
  Medicine,
  Availability,
};
