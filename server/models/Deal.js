const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Deal = sequelize.define(
  "Deal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      // Company / deal name, e.g. "Acme Corp"
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      // Deal value in whole currency units, e.g. 12000
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stage: {
      // Pipeline column. Kept as a plain string (not a DB enum) on purpose —
      // easy to add/rename stages later without a migration.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Leads", // Leads | Contacted | Proposal | Won | Lost
    },
    tag: {
      // Small status label on the card, e.g. "Inbound", "Demo Scheduled"
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      // Which user this deal is assigned to
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "deals",
    timestamps: true,
  }
);

module.exports = Deal;
