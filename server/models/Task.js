const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Field names match the Tasks UI directly (title, dueDate, assignedTo, etc.)
// so the frontend can send/receive task objects with no adapter layer.
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
      defaultValue: "Medium", // High | Medium | Low
    },
    dueDate: {
      // "YYYY-MM-DD"
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueTime: {
      // Free text to match the UI directly, e.g. "12:00 PM"
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
      defaultValue: "Pending", // Pending | In Progress | Completed
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Who the task is FOR (the person whose task list it shows up on).
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Denormalized display name of the owner — avoids a join for the admin
    // task table, matches the frontend's "assignedTo" field directly.
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Who created/assigned the task — null/self if the employee made it
    // themselves, or an admin's id+name if it was assigned to them.
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Kept in sync with status === "Completed" so simple count queries
    // (e.g. admin stats) don't need a string comparison.
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

module.exports = Task;
