const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Announcement = sequelize.define("Announcement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING(100),
    defaultValue: "Admin",
  },
  authorAvatar: {
    type: DataTypes.TEXT, // base64 or URL
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    defaultValue: "General",
  },
}, {
  tableName: "announcements",
  timestamps: true, // adds createdAt, updatedAt
});

module.exports = Announcement;
