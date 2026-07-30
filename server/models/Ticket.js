const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Open", // "Open" | "Assigned" | "In Progress" | "Waiting for Employee" | "Resolved" | "Closed"
    },
    attachments: {
      type: DataTypes.JSON, // array of { name, fileUrl, size }
      allowNull: true,
      defaultValue: [],
    },
    assignedToId: { type: DataTypes.UUID, allowNull: true },
    assignedToName: { type: DataTypes.STRING, allowNull: true },
    replies: {
      type: DataTypes.JSON, // array of { id, senderId, senderName, senderRole, text, attachments, createdAt }
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "tickets",
    timestamps: true,
  }
);

module.exports = Ticket;
