const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  editMessage,
  deleteMessage,
  getUnreadCount,
} = require("../controllers/chatController");

router.use(requireAuth);

router.get("/unread-count", getUnreadCount);
router.post("/request", sendChatRequest);
router.get("/requests", getIncomingRequests);
router.post("/request/:id/accept", acceptChatRequest);
router.post("/request/:id/decline", declineChatRequest);

router.get("/conversations", getConversations);
router.patch("/conversations/:id/read", markConversationRead);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.patch("/messages/:id", editMessage);
router.delete("/messages/:id", deleteMessage);

module.exports = router;
