const { Op } = require("sequelize");
const ChatGroup = require("../models/ChatGroup");
const GroupMember = require("../models/GroupMember");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { emitToUser } = require("../utils/socket");

const SAFE_USER_ATTRS = ["id", "fullName", "email", "role", "avatarUrl"];

// Fetch member rows for one or more groups, plus the User record for each
// member — used by every endpoint below that needs to know/notify who's in
// a group.
const getMembersWithUsers = async (groupIds) => {
  const ids = Array.isArray(groupIds) ? groupIds : [groupIds];
  const members = await GroupMember.findAll({ where: { groupId: ids } });
  const userIds = members.map((m) => m.userId);
  const users = await User.findAll({ where: { id: userIds }, attributes: SAFE_USER_ATTRS });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  return members.map((m) => ({ ...m.toJSON(), user: userMap[m.userId] || null }));
};

// POST /api/chat/groups  body: { groupName, groupDescription?, memberIds: [] }
// Admin-only (enforced by requireAdmin in the route). Creates the group,
// inserts every member (creator included, as "admin"), then emits
// "chat:group-created" to each member's personal socket room so it shows up
// on their side immediately — without a refresh, per the required mechanism.
const createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, memberIds } = req.body;
    const creatorId = req.user.id;

    if (!groupName || !groupName.trim()) {
      return res.status(400).json({ success: false, message: "groupName is required" });
    }
    const uniqueMemberIds = [...new Set((memberIds || []).filter((id) => id && id !== creatorId))];

    const group = await ChatGroup.create({
      groupName: groupName.trim(),
      groupDescription: groupDescription || null,
      createdBy: creatorId,
      lastMessageAt: new Date(),
    });

    // Creator is always a member with the "admin" role for this group.
    await GroupMember.bulkCreate([
      { groupId: group.id, userId: creatorId, role: "admin" },
      ...uniqueMemberIds.map((userId) => ({ groupId: group.id, userId, role: "member" })),
    ]);

    const members = await getMembersWithUsers(group.id);
    const groupPayload = { ...group.toJSON(), members, unreadCount: 0 };

    // Notify every member (including the creator, for multi-tab/device sync).
    [creatorId, ...uniqueMemberIds].forEach((userId) => {
      emitToUser(userId, "chat:group-created", groupPayload);
    });

    return res.status(201).json({ success: true, group: groupPayload });
  } catch (error) {
    console.error("Create group error:", error);
    return res.status(500).json({ success: false, message: "Server error creating group" });
  }
};

// GET /api/chat/groups — every group I belong to, most-recently-active first.
// This is what makes a group visible after a fresh login (Socket.IO events
// only reach you while connected; this query is the persistent fallback).
const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const myMemberships = await GroupMember.findAll({ where: { userId } });
    const groupIds = myMemberships.map((m) => m.groupId);
    if (groupIds.length === 0) {
      return res.status(200).json({ success: true, groups: [] });
    }

    const groups = await ChatGroup.findAll({
      where: { id: groupIds },
      order: [["lastMessageAt", "DESC"]],
    });

    const allMembers = await getMembersWithUsers(groupIds);
    const membersByGroup = {};
    allMembers.forEach((m) => {
      membersByGroup[m.groupId] = membersByGroup[m.groupId] || [];
      membersByGroup[m.groupId].push(m);
    });
    const myUnreadByGroup = Object.fromEntries(myMemberships.map((m) => [m.groupId, m.unreadCount]));

    const enriched = groups.map((g) => ({
      ...g.toJSON(),
      members: membersByGroup[g.id] || [],
      unreadCount: myUnreadByGroup[g.id] || 0,
    }));

    return res.status(200).json({ success: true, groups: enriched });
  } catch (error) {
    console.error("Get my groups error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching groups" });
  }
};

// Shared guard: 404s if the caller isn't a member of the group, otherwise
// returns their membership row (handy for role checks).
const requireMembership = async (groupId, userId) =>
  GroupMember.findOne({ where: { groupId, userId } });

// GET /api/chat/groups/:groupId/messages
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const membership = await requireMembership(groupId, req.user.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const messages = await ChatMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      limit: 200,
    });

    if (membership.unreadCount !== 0) {
      membership.unreadCount = 0;
      await membership.save();
    }

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get group messages error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching group messages" });
  }
};

// POST /api/chat/groups/:groupId/messages  body: { message, attachmentUrl?, attachmentName?, attachmentType? }
const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message, attachmentUrl, attachmentName, attachmentType } = req.body;
    const text = (message || "").trim();

    const membership = await requireMembership(groupId, req.user.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    if (!text && !attachmentUrl) {
      return res.status(400).json({ success: false, message: "message or attachment is required" });
    }

    const chatMessage = await ChatMessage.create({
      groupId,
      senderId: req.user.id,
      message: text,
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null,
    });

    await ChatGroup.update({ lastMessageAt: new Date() }, { where: { id: groupId } });

    // Bump every other member's unread counter for this group.
    await GroupMember.increment("unreadCount", { by: 1, where: { groupId, userId: { [Op.ne]: req.user.id } } });

    const members = await GroupMember.findAll({ where: { groupId } });
    members
      .filter((m) => m.userId !== req.user.id)
      .forEach((m) => emitToUser(m.userId, "chat:group-message-received", { message: chatMessage, groupId }));

    return res.status(201).json({ success: true, chatMessage });
  } catch (error) {
    console.error("Send group message error:", error);
    return res.status(500).json({ success: false, message: "Server error sending group message" });
  }
};

// PUT /api/chat/groups/:groupId  body: { groupName?, groupDescription? } — admin only
const editGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const membership = await requireMembership(groupId, req.user.id);
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only a group admin can edit this group" });
    }

    const group = await ChatGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    if (req.body.groupName?.trim()) group.groupName = req.body.groupName.trim();
    if (req.body.groupDescription !== undefined) group.groupDescription = req.body.groupDescription;
    await group.save();

    const members = await GroupMember.findAll({ where: { groupId } });
    members.forEach((m) => emitToUser(m.userId, "chat:group-updated", { group: group.toJSON() }));

    return res.status(200).json({ success: true, group });
  } catch (error) {
    console.error("Edit group error:", error);
    return res.status(500).json({ success: false, message: "Server error editing group" });
  }
};

// POST /api/chat/groups/:groupId/members  body: { memberIds: [] } — admin only, adds people to an existing group
const addGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const membership = await requireMembership(groupId, req.user.id);
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only a group admin can add members" });
    }

    const existing = await GroupMember.findAll({ where: { groupId } });
    const existingIds = new Set(existing.map((m) => m.userId));
    const newIds = [...new Set((req.body.memberIds || []))].filter((id) => id && !existingIds.has(id));

    if (newIds.length > 0) {
      await GroupMember.bulkCreate(newIds.map((userId) => ({ groupId, userId, role: "member" })));
    }

    const group = await ChatGroup.findByPk(groupId);
    const members = await getMembersWithUsers(groupId);
    const groupPayload = { ...group.toJSON(), members };

    // Existing members get an updated member list; new members get the full
    // "a group just appeared for you" event, same as at creation time.
    existing.forEach((m) => emitToUser(m.userId, "chat:group-updated", { group: groupPayload }));
    newIds.forEach((userId) => emitToUser(userId, "chat:group-created", { ...groupPayload, unreadCount: 0 }));

    return res.status(200).json({ success: true, group: groupPayload });
  } catch (error) {
    console.error("Add group members error:", error);
    return res.status(500).json({ success: false, message: "Server error adding members" });
  }
};

// DELETE /api/chat/groups/:groupId/members/:userId — admin only (or self-removal / "leave group")
const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const membership = await requireMembership(groupId, req.user.id);
    if (!membership) return res.status(404).json({ success: false, message: "Group not found" });
    if (membership.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Only a group admin can remove other members" });
    }

    await GroupMember.destroy({ where: { groupId, userId } });
    emitToUser(userId, "chat:group-removed", { groupId });

    const remaining = await GroupMember.findAll({ where: { groupId } });
    remaining.forEach((m) => emitToUser(m.userId, "chat:group-member-removed", { groupId, userId }));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Remove group member error:", error);
    return res.status(500).json({ success: false, message: "Server error removing member" });
  }
};

// DELETE /api/chat/groups/:groupId — admin only
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const membership = await requireMembership(groupId, req.user.id);
    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only a group admin can delete this group" });
    }

    const members = await GroupMember.findAll({ where: { groupId } });
    await ChatMessage.destroy({ where: { groupId } });
    await GroupMember.destroy({ where: { groupId } });
    await ChatGroup.destroy({ where: { id: groupId } });

    members.forEach((m) => emitToUser(m.userId, "chat:group-removed", { groupId }));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete group error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting group" });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupMessages,
  sendGroupMessage,
  editGroup,
  addGroupMembers,
  removeGroupMember,
  deleteGroup,
};
