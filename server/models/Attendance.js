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
    timeIn: { type: DataTypes.STRING, allowNull: false }, 
    timeOut: { type: DataTypes.STRING, allowNull: true }, 
    totalHours: { type: DataTypes.FLOAT, allowNull: true },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Completed", 
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
    indexes: [{ fields: ["employeeId", "date"] }],
  }
);

module.exports = Attendance;
