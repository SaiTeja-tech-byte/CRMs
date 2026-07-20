const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ChatRequest = sequelize.define(
  "ChatRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending", // pending | accepted | declined
    },
    respondedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "chat_requests",
    timestamps: true,
  }
);

module.exports = ChatRequest;
