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
    attendanceDate: { type: DataTypes.DATEONLY, allowNull: true },
    morningCheckIn: { type: DataTypes.STRING, allowNull: true }, 
    lunchOut: { type: DataTypes.STRING, allowNull: true }, 
    lunchResume: { type: DataTypes.STRING, allowNull: true }, 
    finalCheckOut: { type: DataTypes.STRING, allowNull: true }, 
    totalWorkingMinutes: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    totalBreakMinutes: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Working", // "Working", "On Break", "Completed", "Absent", "Late"
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
    indexes: [{ fields: ["employeeId", "attendanceDate"] }],
  }
);

module.exports = Attendance;
