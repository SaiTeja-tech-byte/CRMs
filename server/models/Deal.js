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
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Leads",
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "deals",
    timestamps: true,
    indexes: [{ fields: ["ownerId"] }],
  }
);

module.exports = Deal;
