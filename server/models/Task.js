const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Task = sequelize.define(
  "Task",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Medium",
    },
    dueDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Sales",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
    indexes: [
      { fields: ["ownerId"] },
      { fields: ["ownerId", "createdAt"] },
    ],
  }
);

module.exports = Task;
