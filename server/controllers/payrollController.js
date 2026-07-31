const Payroll = require("../models/Payroll");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { getIo } = require("../utils/socket");

exports.createPayroll = async (req, res) => {
  try {
    const { employeeId, payPeriodMonth, payPeriodYear, ...financials } = req.body;
    
    const user = await User.findByPk(employeeId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const { 
      basicSalary = 0, hra = 0, allowances = 0, bonus = 0, incentives = 0,
      tax = 0, pf = 0, esi = 0, professionalTax = 0, otherDeductions = 0,
      paymentDate, paymentMethod, transactionReference, status
    } = financials;

    const grossSalary = Number(basicSalary) + Number(hra) + Number(allowances) + Number(bonus) + Number(incentives);
    const totalDeductions = Number(tax) + Number(pf) + Number(esi) + Number(professionalTax) + Number(otherDeductions);
    const netSalary = grossSalary - totalDeductions;

    const payroll = await Payroll.create({
      employeeId,
      employeeName: user.name,
      department: user.department || "General",
      designation: user.designation || "Employee",
      payPeriodMonth,
      payPeriodYear,
      basicSalary, hra, allowances, bonus, incentives,
      tax, pf, esi, professionalTax, otherDeductions,
      grossSalary, netSalary,
      paymentDate, paymentMethod, transactionReference,
      status: status || "Pending"
    });

    const io = getIo();
    if (io) {
      io.emit("payroll:new", payroll);
    }

    if (status === "Processed" || status === "Paid") {
      let text = status === "Paid" ? `Salary credited for ${payPeriodMonth} ${payPeriodYear}` : `Payroll processed for ${payPeriodMonth} ${payPeriodYear}`;
      await Notification.create({
        userId: employeeId,
        text,
        icon: "bi-wallet2",
        type: "system",
      });
    }

    res.status(201).json({ success: true, payroll });
  } catch (error) {
    console.error("Error creating payroll:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ success: false, message: "Payroll not found" });
    }
    
    const previousStatus = payroll.status;
    const { 
      basicSalary, hra, allowances, bonus, incentives,
      tax, pf, esi, professionalTax, otherDeductions,
      paymentDate, paymentMethod, transactionReference, status 
    } = req.body;

    if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
    if (hra !== undefined) payroll.hra = hra;
    if (allowances !== undefined) payroll.allowances = allowances;
    if (bonus !== undefined) payroll.bonus = bonus;
    if (incentives !== undefined) payroll.incentives = incentives;
    
    if (tax !== undefined) payroll.tax = tax;
    if (pf !== undefined) payroll.pf = pf;
    if (esi !== undefined) payroll.esi = esi;
    if (professionalTax !== undefined) payroll.professionalTax = professionalTax;
    if (otherDeductions !== undefined) payroll.otherDeductions = otherDeductions;
    
    payroll.grossSalary = Number(payroll.basicSalary) + Number(payroll.hra) + Number(payroll.allowances) + Number(payroll.bonus) + Number(payroll.incentives);
    const totalDeductions = Number(payroll.tax) + Number(payroll.pf) + Number(payroll.esi) + Number(payroll.professionalTax) + Number(payroll.otherDeductions);
    payroll.netSalary = payroll.grossSalary - totalDeductions;

    if (paymentDate !== undefined) payroll.paymentDate = paymentDate;
    if (paymentMethod !== undefined) payroll.paymentMethod = paymentMethod;
    if (transactionReference !== undefined) payroll.transactionReference = transactionReference;
    if (status !== undefined) payroll.status = status;

    await payroll.save();

    const io = getIo();
    if (io) {
      io.emit("payroll:updated", payroll);
    }

    if (status && status !== previousStatus && (status === "Processed" || status === "Paid")) {
      let text = status === "Paid" ? `Salary credited for ${payroll.payPeriodMonth} ${payroll.payPeriodYear}` : `Payroll processed for ${payroll.payPeriodMonth} ${payroll.payPeriodYear}`;
      await Notification.create({
        userId: payroll.employeeId,
        text,
        icon: "bi-wallet2",
        type: "system",
      });
    }

    res.json({ success: true, payroll });
  } catch (error) {
    console.error("Error updating payroll:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, payrolls });
  } catch (error) {
    console.error("Error fetching all payrolls:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMyPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      where: { employeeId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, payrolls });
  } catch (error) {
    console.error("Error fetching my payrolls:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
