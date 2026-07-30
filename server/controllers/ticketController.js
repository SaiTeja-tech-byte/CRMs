const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { getIo } = require("../utils/socket");

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, attachments } = req.body;
    
    const user = await User.findByPk(req.user.id);
    const department = user.department || "General";
    const employeeName = user.name;

    const ticket = await Ticket.create({
      employeeId: req.user.id,
      employeeName,
      department,
      subject,
      description,
      category,
      priority,
      attachments: attachments || [],
    });

    const io = getIo();
    if (io) {
      io.emit("ticket:new", ticket);
    }

    // Notify admins
    const admins = await User.findAll({ where: { role: "admin" } });
    for (const admin of admins) {
      await Notification.create({
        userId: admin.id,
        text: `New support ticket: ${subject}`,
        icon: "bi-life-preserver",
        type: "system",
      });
    }

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { employeeId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedToId, assignedToName } = req.body;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    // Security checks: employee can only close their own ticket
    if (req.user.role === "employee" && ticket.employeeId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (req.user.role === "employee" && status !== "Closed") {
      return res.status(403).json({ success: false, message: "Employee can only Close tickets" });
    }

    if (status) ticket.status = status;
    if (assignedToId) ticket.assignedToId = assignedToId;
    if (assignedToName) ticket.assignedToName = assignedToName;

    await ticket.save();

    const io = getIo();
    if (io) {
      io.emit("ticket:updated", ticket);
    }

    // Send notification
    if (req.user.role === "admin" && status) {
      await Notification.create({
        userId: ticket.employeeId,
        text: `Your ticket "${ticket.subject}" is now ${status}.`,
        icon: "bi-life-preserver",
        type: "system",
      });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, attachments } = req.body;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (req.user.role === "employee" && ticket.employeeId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const user = await User.findByPk(req.user.id);
    
    const newReply = {
      id: "RPL-" + Date.now(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text,
      attachments: attachments || [],
      createdAt: new Date().toISOString()
    };

    // Use spread to trigger Sequelize JSON update
    ticket.replies = [...(ticket.replies || []), newReply];
    
    // Automatically adjust status if needed
    if (user.role === "employee" && (ticket.status === "Waiting for Employee" || ticket.status === "Resolved")) {
        ticket.status = "In Progress";
    }

    await ticket.save();

    const io = getIo();
    if (io) {
      io.emit("ticket:updated", ticket);
    }

    // Notifications
    if (user.role === "admin") {
      await Notification.create({
        userId: ticket.employeeId,
        text: `New reply on your ticket: ${ticket.subject}`,
        icon: "bi-reply",
        type: "system",
      });
    } else {
      // notify assigned admin or all admins
      if (ticket.assignedToId) {
        await Notification.create({
          userId: ticket.assignedToId,
          text: `New reply from ${user.name} on ticket: ${ticket.subject}`,
          icon: "bi-reply",
          type: "system",
        });
      } else {
        const admins = await User.findAll({ where: { role: "admin" } });
        for (const admin of admins) {
          await Notification.create({
            userId: admin.id,
            text: `New reply from ${user.name} on ticket: ${ticket.subject}`,
            icon: "bi-reply",
            type: "system",
          });
        }
      }
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error("Error replying to ticket:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
