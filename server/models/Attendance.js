const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee", // "employee" | "admin"
    },
    date: {
      type: DataTypes.STRING, // e.g. "2026-08-03"
      allowNull: false,
    },
    tapInTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tapOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    workingHours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breakTime: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0h 0m",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Not Checked In", // "Not Checked In", "Working", "Completed", "Absent", "Late"
    },
  },
  {
    tableName: "attendances",
    timestamps: true,
  }
);

module.exports = Attendance;
