const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      // Who this notification belongs to
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      // Matches the icon class used in the UI, e.g. "bi-file-earmark-check"
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Lets a section (Documents, Settings/System) show its own badge count
    // by filtering on type instead of only the combined bell count.
    // "general" | "document" | "system"
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

module.exports = Notification;
