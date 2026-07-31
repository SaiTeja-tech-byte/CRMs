const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Payroll = sequelize.define(
  "Payroll",
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
    payPeriodMonth: { type: DataTypes.STRING, allowNull: false },
    payPeriodYear: { type: DataTypes.INTEGER, allowNull: false },
    
    basicSalary: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    hra: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    allowances: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    bonus: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    incentives: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    
    tax: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    pf: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    esi: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    professionalTax: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    otherDeductions: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    
    grossSalary: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    netSalary: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    
    paymentDate: { type: DataTypes.DATE, allowNull: true },
    paymentMethod: { type: DataTypes.STRING, allowNull: true },
    transactionReference: { type: DataTypes.STRING, allowNull: true },
    
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", 
    },
  },
  {
    tableName: "payrolls",
    timestamps: true,
  }
);

module.exports = Payroll;