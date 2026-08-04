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

    // Personal Information (Me page)
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    displayName: { type: DataTypes.STRING, allowNull: true },
    dob: { type: DataTypes.DATEONLY, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true },
    nationality: { type: DataTypes.STRING, allowNull: true },

    // Work Information (Me page)
    employmentType: { type: DataTypes.STRING, allowNull: true },
    joiningDate: { type: DataTypes.DATEONLY, allowNull: true },
    salary: { type: DataTypes.INTEGER, allowNull: true },
    workMode: { type: DataTypes.STRING, allowNull: true, defaultValue: "Office" },

    // Contact Information (Me page)
    officialEmail: { type: DataTypes.STRING, allowNull: true },
    personalEmail: { type: DataTypes.STRING, allowNull: true },
    alternatePhone: { type: DataTypes.STRING, allowNull: true },
    emergencyContact: { type: DataTypes.STRING, allowNull: true },
    emergencyPhone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    zipCode: { type: DataTypes.STRING, allowNull: true },

    // About / social (Me page)
    bio: { type: DataTypes.TEXT, allowNull: true },
    skills: { type: DataTypes.TEXT, allowNull: true },
    experience: { type: DataTypes.STRING, allowNull: true },
    languagesKnown: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.TEXT, allowNull: true }, // base64 image data from the Me page uploader
    linkedin: { type: DataTypes.STRING, allowNull: true },
    portfolio: { type: DataTypes.STRING, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },

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
