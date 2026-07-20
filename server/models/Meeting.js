const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Meeting = sequelize.define(
  "Meeting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      // Company / meeting name, e.g. "Amazon"
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      // e.g. "Product Demo", "Sales Discussion"
      type: DataTypes.STRING,
      allowNull: true,
    },
    meetingTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // Pending | Confirmed
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "meetings",
    timestamps: true,
  }
);

module.exports = Meeting;
