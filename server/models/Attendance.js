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
    employeeId: { type: DataTypes.UUID, allowNull: false },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    sessionNo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    timeIn: { type: DataTypes.STRING, allowNull: false }, // "HH:MM"
    timeOut: { type: DataTypes.STRING, allowNull: true }, // "HH:MM", null while this session is open
    durationMinutes: { type: DataTypes.INTEGER, allowNull: true }, // this session's worked minutes
    totalHours: { type: DataTypes.FLOAT, allowNull: true }, // kept for backward compatibility (this session's hours)
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Working", // "Working" (session open) | "Completed" (session closed) | "Approved" (regularization)
    },

    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "tap", // "tap" | "regularization"
    },
    regularizationId: { type: DataTypes.UUID, allowNull: true },
  },
  {
    tableName: "attendance",
    timestamps: true,
    indexes: [
      { fields: ["employeeId", "date"] },
      { unique: true, fields: ["employeeId", "date", "sessionNo"] },
    ],
  }
);

module.exports = Attendance;
