const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const AttendanceRegularization = sequelize.define(
  "AttendanceRegularization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    timeIn: { type: DataTypes.STRING, allowNull: false }, // "HH:MM"
    timeOut: { type: DataTypes.STRING, allowNull: false }, // "HH:MM"
    reason: { type: DataTypes.STRING, allowNull: true }, // e.g. "CRM Maintenance"
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // "Pending" | "Approved" | "Rejected"
    },
    reviewedById: { type: DataTypes.UUID, allowNull: true },
    reviewedByName: { type: DataTypes.STRING, allowNull: true },
    reviewNote: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "attendance_regularizations",
    timestamps: true,
  }
);

module.exports = AttendanceRegularization;
