const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Kept generic (userAId/userBId) rather than a join table for MVP scope —
// group/task chats can be added later using ConversationMember instead.
const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "direct", // "direct" for now; "group"/"task" reserved for later
    },
    userAId: { type: DataTypes.UUID, allowNull: false },
    userBId: { type: DataTypes.UUID, allowNull: false },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "conversations",
    timestamps: true,
  }
);

module.exports = Conversation;
