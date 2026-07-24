const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Public-facing - no user account required to submit. The customer is
// identified purely by the email they typed in, which is also where any
// admin reply gets sent.
const ContactQuery = sequelize.define(
  "ContactQuery",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    company: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new", // new | assigned | replied | closed
    },
    // Separate from `status` - `status` tracks the reply workflow, `isRead`
    // is purely for the sidebar badge count and gets set true the moment an
    // admin opens the query, regardless of what happens to it afterward.
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    assignedToId: { type: DataTypes.UUID, allowNull: true },

    reply: { type: DataTypes.TEXT, allowNull: true },
    repliedAt: { type: DataTypes.DATE, allowNull: true },
    repliedById: { type: DataTypes.UUID, allowNull: true },
  },
  {
    tableName: "contact_queries",
    timestamps: true,
  }
);

module.exports = ContactQuery;
