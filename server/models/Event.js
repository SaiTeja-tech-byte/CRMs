const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true, defaultValue: "Meeting" },
    date: { type: DataTypes.STRING, allowNull: true },
    startTime: { type: DataTypes.STRING, allowNull: true },
    endTime: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    priority: { type: DataTypes.STRING, allowNull: true, defaultValue: "Medium" },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Pending" },
    color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#2563eb" },
    ownerId: { type: DataTypes.UUID, allowNull: true },
    assignedTo: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    createdById: { type: DataTypes.UUID, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "events",
    timestamps: true,
    indexes: [{ fields: ["ownerId"] }],
  }
);

module.exports = Event;
