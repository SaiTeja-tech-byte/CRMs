const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Base64 data URL or an external URL (e.g. Cloudinary/S3) — same pattern
    // already used by Announcement.authorAvatar. Kept as TEXT so either fits.
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "General",
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "General",
    },
    size: {
      // Human-readable size string (e.g. "2.4 MB"), matching the UI directly.
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    uploadedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Everyone", // "Everyone" | "Specific Department" | "Admins Only"
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Shared", // "Shared" | "Private"
    },
  },
  {
    tableName: "documents",
    timestamps: true, // createdAt doubles as "lastModified"
  }
);

module.exports = Document;
