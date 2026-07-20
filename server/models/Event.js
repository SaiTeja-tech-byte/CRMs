const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Field names match the Calendar UI directly (title, date, startTime,
// assignedTo, etc.) — same approach as Task.js. Deliberately separate from
// models/Meeting.js, which is a different concept (a sales call tied to a
// deal: title/subtitle/meetingTime/status) without the fields a general
// calendar event needs (date, start/end time, type, location, department...).
const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true, defaultValue: "Meeting" },
    date: { type: DataTypes.STRING, allowNull: true }, // "YYYY-MM-DD"
    startTime: { type: DataTypes.STRING, allowNull: true },
    endTime: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    priority: { type: DataTypes.STRING, allowNull: true, defaultValue: "Medium" },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Pending" }, // Pending | Completed
    color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#2563eb" },
    // Who the event is FOR (whose calendar it shows up on).
    ownerId: { type: DataTypes.UUID, allowNull: true },
    // Denormalized display fields — avoids a join for the admin table.
    assignedTo: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    // Who created/scheduled the event (self, or an admin who assigned it).
    createdById: { type: DataTypes.UUID, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

module.exports = Event;
