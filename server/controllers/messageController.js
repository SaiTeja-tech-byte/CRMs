const Message = require("../models/Message");

// GET /api/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { recipientId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching messages" });
  }
};

module.exports = { getMessages };
