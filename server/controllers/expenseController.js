const Expense = require("../models/Expense");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { emitToUser, emitToAdmins } = require("../utils/socket");

const createExpense = async (req, res) => {
  try {
    const { title, category, amount, date, paymentMethod, description, receipts } = req.body;

    const expense = await Expense.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      department: req.user.department || "General",
      designation: req.user.designation || "Employee",
      title,
      category,
      amount,
      date,
      paymentMethod,
      description,
      receipts: receipts || [],
      status: "Pending",
    });

    const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id"] });
    const text = `${req.user.fullName} submitted a new expense claim for ₹${parseFloat(amount).toFixed(2)}`;
    
    await Promise.all(
      admins.map((admin) =>
        Notification.create({ userId: admin.id, text, icon: "bi-receipt" })
      )
    );
    
    emitToAdmins("expense:new", { expense });
    emitToAdmins("notification:new", { text });

    return res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error("Create expense error:", error);
    return res.status(500).json({ success: false, message: "Server error creating expense claim" });
  }
};

const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { employeeId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error("Get my expenses error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching expenses" });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error("Get all expenses error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching all expenses" });
  }
};

const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectReason } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    // Ensure employees can only withdraw their own pending expenses
    if (req.user.role !== "admin") {
      if (expense.employeeId !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      if (status !== "Withdrawn") {
        return res.status(400).json({ success: false, message: "Employees can only withdraw expenses" });
      }
      if (expense.status !== "Pending") {
        return res.status(400).json({ success: false, message: "Can only withdraw pending expenses" });
      }
    }

    expense.status = status;
    if (status === "Rejected") {
      expense.rejectReason = rejectReason || "No reason provided";
    }
    
    if (req.user.role === "admin") {
      expense.reviewedById = req.user.id;
      expense.reviewedByName = req.user.fullName;
    }

    await expense.save();

    // Notify appropriate parties
    if (status === "Withdrawn") {
      const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id"] });
      const text = `${req.user.fullName} withdrew their expense claim for ₹${parseFloat(expense.amount).toFixed(2)}`;
      
      await Promise.all(
        admins.map((admin) =>
          Notification.create({ userId: admin.id, text, icon: "bi-receipt" })
        )
      );
      emitToAdmins("expense:updated", { expense });
      emitToAdmins("notification:new", { text });
    } else if (status === "Approved" || status === "Rejected" || status === "Reimbursed") {
      const text = `Your expense claim '${expense.title}' was ${status.toLowerCase()}${status === "Rejected" ? ` for reason: ${expense.rejectReason}` : ""}.`;
      await Notification.create({ userId: expense.employeeId, text, icon: "bi-receipt" });
      
      emitToUser(expense.employeeId, "expense:updated", { expense });
      emitToUser(expense.employeeId, "notification:new", { text });
      
      // Update admins' UI too
      emitToAdmins("expense:updated", { expense });
    }

    return res.status(200).json({ success: true, expense });
  } catch (error) {
    console.error("Update expense status error:", error);
    return res.status(500).json({ success: false, message: "Server error updating expense status" });
  }
};

module.exports = {
  createExpense,
  getMyExpenses,
  getAllExpenses,
  updateExpenseStatus,
};
