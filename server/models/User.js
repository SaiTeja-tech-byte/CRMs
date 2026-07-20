const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    // Nullable because Google sign-in users don't have a local password
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Email OTP fields (used for both signup verification and login 2FA)
    otpCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Password reset fields
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Profile / employee info shown on the dashboard
    employeeId: { type: DataTypes.STRING, allowNull: true },
    designation: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    officeLocation: { type: DataTypes.STRING, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    reportingManager: { type: DataTypes.STRING, allowNull: true },
    employmentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Active",
    },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },

    // Distinguishes admin accounts from regular employee accounts.
    // Admin accounts are created manually (DB/seed), not via public register.
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee", // "employee" | "admin"
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;