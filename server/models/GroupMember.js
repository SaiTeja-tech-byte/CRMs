const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "member" }, // "admin" | "member"
    // Same unread-badge pattern as Conversation.userAUnread/userBUnread, just
    // per-member instead of per-pair since a group has N members.
    unreadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "group_members",
    timestamps: true,
    indexes: [{ unique: true, fields: ["groupId", "userId"] }],
  }
);

module.exports = GroupMember;
