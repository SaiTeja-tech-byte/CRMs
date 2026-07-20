const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Note: this project already has a different "Message" model used for the
// old top-nav messages dropdown (client/src/services or server/models -
// check before mounting routes). This one is intentionally named
// ChatMessage to avoid colliding with that existing model/table.
const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: { type: DataTypes.UUID, allowNull: false },
    senderId: { type: DataTypes.UUID, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    edited: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "chat_messages",
    timestamps: true,
  }
);

module.exports = ChatMessage;
