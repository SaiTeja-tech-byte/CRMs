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
    
    otpCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
   
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  
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


    bio: { type: DataTypes.TEXT, allowNull: true },
    skills: { type: DataTypes.TEXT, allowNull: true },
    experience: { type: DataTypes.STRING, allowNull: true },
    languagesKnown: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.TEXT, allowNull: true }, 
    linkedin: { type: DataTypes.STRING, allowNull: true },
    portfolio: { type: DataTypes.STRING, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },

   
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee", 
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
