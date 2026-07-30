const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, ticketController.createTicket);
router.get("/mine", protect, authorize("employee"), ticketController.getMyTickets);
router.get("/", protect, authorize("admin"), ticketController.getAllTickets);
router.patch("/:id", protect, ticketController.updateTicketStatus);
router.post("/:id/reply", protect, ticketController.replyToTicket);

module.exports = router;
