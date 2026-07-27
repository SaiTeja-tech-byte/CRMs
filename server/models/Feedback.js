const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    feedbackType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chatType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "New",
      allowNull: false,
    }
  },
  {
    tableName: "feedbacks",
    timestamps: true,
  }
);

Feedback.belongsTo(User, { as: "submitter", foreignKey: "submittedBy" });
User.hasMany(Feedback, { foreignKey: "submittedBy" });

module.exports = Feedback;
