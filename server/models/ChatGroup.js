const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// A group chat. Members live in the separate GroupMember join table so a
// group can have any number of participants (unlike Conversation, which is
// fixed at two users).
const ChatGroup = sequelize.define(
  "ChatGroup",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupName: { type: DataTypes.STRING, allowNull: false },
    groupDescription: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: false },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "chat_groups",
    timestamps: true,
  }
);

module.exports = ChatGroup;
