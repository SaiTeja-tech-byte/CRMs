const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  editMessage,
  deleteMessage,
  searchMessages,
} = require("../controllers/chatController");
const {
  createGroup,
  getMyGroups,
  getGroupMessages,
  sendGroupMessage,
  editGroup,
  addGroupMembers,
  removeGroupMember,
  deleteGroup,
} = require("../controllers/groupChatController");

router.use(requireAuth);

router.get("/unread-count", getUnreadCount);
router.get("/search", searchMessages);
router.post("/request", sendChatRequest);
router.get("/requests", getIncomingRequests);
router.post("/request/:id/accept", acceptChatRequest);
router.post("/request/:id/decline", declineChatRequest);

router.get("/conversations", getConversations);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.put("/messages/:id", editMessage);
router.delete("/messages/:id", deleteMessage);

// Group chat — only admins can create/edit/delete a group or add members;
// any member can read/send messages, and anyone can remove themselves.
router.post("/groups", requireAdmin, createGroup);
router.get("/groups", getMyGroups);
router.get("/groups/:groupId/messages", getGroupMessages);
router.post("/groups/:groupId/messages", sendGroupMessage);
router.put("/groups/:groupId", requireAdmin, editGroup);
router.post("/groups/:groupId/members", requireAdmin, addGroupMembers);
router.delete("/groups/:groupId/members/:userId", removeGroupMember);
router.delete("/groups/:groupId", requireAdmin, deleteGroup);

module.exports = router;
