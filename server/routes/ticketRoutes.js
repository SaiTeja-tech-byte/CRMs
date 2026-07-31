const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

router.post("/", requireAuth, ticketController.createTicket);
router.get("/mine", requireAuth, ticketController.getMyTickets);
router.get("/", requireAuth, requireAdmin, ticketController.getAllTickets);
router.patch("/:id", requireAuth, ticketController.updateTicketStatus);
router.post("/:id/reply", requireAuth, ticketController.replyToTicket);

module.exports = router;
