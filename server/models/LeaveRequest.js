const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// An employee's request for time off, sent to admins for approval — the
// backing store for the "Request Leave" button on the employee dashboard.
const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    type: {
      // "Sick Leave" | "Casual Leave" | "Earned Leave" | "Unpaid Leave" | etc.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Casual Leave",
    },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    // Inclusive day count between startDate and endDate — stored so the
    // balance calculation doesn't need to recompute date math every time.
    days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    reason: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // "Pending" | "Approved" | "Rejected"
    },
    // Who actioned it and any note left when approving/rejecting.
    reviewedById: { type: DataTypes.UUID, allowNull: true },
    reviewedByName: { type: DataTypes.STRING, allowNull: true },
    reviewNote: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "leave_requests",
    timestamps: true,
  }
);

module.exports = LeaveRequest;
