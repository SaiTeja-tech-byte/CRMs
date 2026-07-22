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
    // Exactly one of conversationId (direct chat) / groupId (group chat) is
    // set per row — both nullable so this one table serves both chat types.
    conversationId: { type: DataTypes.UUID, allowNull: true },
    groupId: { type: DataTypes.UUID, allowNull: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    // message can be blank if the send is attachment-only (a photo/file with no caption)
    message: { type: DataTypes.TEXT, allowNull: true, defaultValue: "" },
    attachmentUrl: { type: DataTypes.TEXT, allowNull: true },
    attachmentName: { type: DataTypes.STRING, allowNull: true },
    attachmentType: { type: DataTypes.STRING, allowNull: true }, // MIME type, e.g. "image/png", "application/pdf"
    edited: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Set the moment the recipient actually views this message (conversation
    // opened, or already-open while it arrives). Null = unread. Powers the
    // WhatsApp-style single/double tick indicator on the sender's side.
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "chat_messages",
    timestamps: true,
  }
);

module.exports = ChatMessage;
