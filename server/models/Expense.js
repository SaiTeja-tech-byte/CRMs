const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    designation: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    receipts: {
      type: DataTypes.JSON, // stores array of { name: '...', fileUrl: '...' }
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // "Pending" | "Approved" | "Rejected" | "Withdrawn" | "Reimbursed"
    },
    rejectReason: { type: DataTypes.TEXT, allowNull: true },
    reviewedById: { type: DataTypes.UUID, allowNull: true },
    reviewedByName: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "expenses",
    timestamps: true,
  }
);

module.exports = Expense;
