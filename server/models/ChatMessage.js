const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: { type: DataTypes.UUID, allowNull: true },
    groupId: { type: DataTypes.UUID, allowNull: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true, defaultValue: "" },
    attachmentUrl: { type: DataTypes.TEXT, allowNull: true },
    attachmentName: { type: DataTypes.STRING, allowNull: true },
    attachmentType: { type: DataTypes.STRING, allowNull: true },
    edited: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "chat_messages",
    timestamps: true,
    indexes: [{ fields: ["conversationId"] }, { fields: ["groupId"] }],
  }
);

module.exports = ChatMessage;
