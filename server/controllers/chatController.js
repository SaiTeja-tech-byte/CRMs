const { Op } = require("sequelize");
const ChatRequest = require("../models/ChatRequest");
const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { emitToUser } = require("../utils/socket");

const SAFE_USER_ATTRS = ["id", "fullName", "email", "role", "avatarUrl"];

// Helper: find an existing direct conversation between two users, if any
const findDirectConversation = (userA, userB) =>
  Conversation.findOne({
    where: {
      type: "direct",
      [Op.or]: [
        { userAId: userA, userBId: userB },
        { userAId: userB, userBId: userA },
      ],
    },
  });

// POST /api/chat/request  body: { receiverId }
const sendChatRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }
    if (receiverId === senderId) {
      return res.status(400).json({ success: false, message: "You can't chat with yourself" });
    }

    const receiver = await User.findByPk(receiverId, { attributes: SAFE_USER_ATTRS });
    if (!receiver) {
      return res.status(404).json({ success: false, message: "That user doesn't exist" });
    }

    // Already chatting? Just point them at the existing conversation.
    const existingConversation = await findDirectConversation(senderId, receiverId);
    if (existingConversation) {
      return res.status(200).json({ success: true, conversation: existingConversation, alreadyExists: true });
    }

    // Admin -> Employee messages don't need acceptance, per the plan - open immediately.
    if (req.user.role === "admin") {
      const conversation = await Conversation.create({ userAId: senderId, userBId: receiverId });
      emitToUser(receiverId, "chat:conversation-started", { conversation, from: req.user });
      return res.status(201).json({ success: true, conversation, autoAccepted: true });
    }

    // Otherwise, don't allow duplicate pending requests between the same pair
    const existingRequest = await ChatRequest.findOne({
      where: { senderId, receiverId, status: "pending" },
    });
    if (existingRequest) {
      return res.status(200).json({ success: true, request: existingRequest, alreadyPending: true });
    }

    const request = await ChatRequest.create({ senderId, receiverId, status: "pending" });

    emitToUser(receiverId, "chat:request-received", {
      request,
      sender: { id: req.user.id, fullName: req.user.fullName, email: req.user.email },
    });

    return res.status(201).json({ success: true, request });
  } catch (error) {
    console.error("Send chat request error:", error);
    return res.status(500).json({ success: false, message: "Server error sending chat request" });
  }
};

// GET /api/chat/requests - pending requests addressed to me
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.findAll({
      where: { receiverId: req.user.id, status: "pending" },
      order: [["createdAt", "DESC"]],
    });

    const senderIds = requests.map((r) => r.senderId);
    const senders = await User.findAll({ where: { id: senderIds }, attributes: SAFE_USER_ATTRS });
    const senderMap = Object.fromEntries(senders.map((s) => [s.id, s]));

    const enriched = requests.map((r) => ({ ...r.toJSON(), sender: senderMap[r.senderId] || null }));

    return res.status(200).json({ success: true, requests: enriched });
  } catch (error) {
    console.error("Get chat requests error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching chat requests" });
  }
};

// POST /api/chat/request/:id/accept
const acceptChatRequest = async (req, res) => {
  try {
    const request = await ChatRequest.findOne({
      where: { id: req.params.id, receiverId: req.user.id, status: "pending" },
    });
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    let conversation = await findDirectConversation(request.senderId, request.receiverId);
    if (!conversation) {
      conversation = await Conversation.create({
        userAId: request.senderId,
        userBId: request.receiverId,
      });
    }

    emitToUser(request.senderId, "chat:request-accepted", { request, conversation });

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Accept chat request error:", error);
    return res.status(500).json({ success: false, message: "Server error accepting request" });
  }
};

// POST /api/chat/request/:id/decline
const declineChatRequest = async (req, res) => {
  try {
    const request = await ChatRequest.findOne({
      where: { id: req.params.id, receiverId: req.user.id, status: "pending" },
    });
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "declined";
    request.respondedAt = new Date();
    await request.save();

    emitToUser(request.senderId, "chat:request-declined", { request });

    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Decline chat request error:", error);
    return res.status(500).json({ success: false, message: "Server error declining request" });
  }
};

// GET /api/chat/conversations - my chat list
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: { [Op.or]: [{ userAId: userId }, { userBId: userId }] },
      order: [["lastMessageAt", "DESC"]],
    });

    const otherIds = conversations.map((c) => (c.userAId === userId ? c.userBId : c.userAId));
    const others = await User.findAll({ where: { id: otherIds }, attributes: SAFE_USER_ATTRS });
    const otherMap = Object.fromEntries(others.map((u) => [u.id, u]));

    const enriched = conversations.map((c) => ({
      ...c.toJSON(),
      otherUser: otherMap[c.userAId === userId ? c.userBId : c.userAId] || null,
    }));

    return res.status(200).json({ success: true, conversations: enriched });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching conversations" });
  }
};

// GET /api/chat/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.conversationId);
    if (!conversation || (conversation.userAId !== req.user.id && conversation.userBId !== req.user.id)) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const messages = await ChatMessage.findAll({
      where: { conversationId: req.params.conversationId },
      order: [["createdAt", "ASC"]],
      limit: 200,
    });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching messages" });
  }
};

// POST /api/chat/messages  body: { conversationId, message }
// REST fallback for sending — the frontend can call this OR emit a socket
// event; either path ends up persisting + broadcasting the same way.
const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message?.trim()) {
      return res.status(400).json({ success: false, message: "conversationId and message are required" });
    }

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || (conversation.userAId !== req.user.id && conversation.userBId !== req.user.id)) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const chatMessage = await ChatMessage.create({
      conversationId,
      senderId: req.user.id,
      message: message.trim(),
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    const recipientId = conversation.userAId === req.user.id ? conversation.userBId : conversation.userAId;
    emitToUser(recipientId, "chat:message-received", { message: chatMessage, conversationId });

    return res.status(201).json({ success: true, chatMessage });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ success: false, message: "Server error sending message" });
  }
};

module.exports = {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage,
};
