const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      // Full display string, e.g. "Tesla Deal stage moved to Proposal"
      type: DataTypes.STRING,
      allowNull: false,
    },
    actorId: {
      // Who performed the action
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true, // createdAt doubles as the "X mins ago" timestamp
  }
);

module.exports = ActivityLog;
