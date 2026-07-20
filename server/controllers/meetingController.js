const Meeting = require("../models/Meeting");

// GET /api/meetings
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Get meetings error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching meetings" });
  }
};

// POST /api/meetings
const createMeeting = async (req, res) => {
  try {
    const { title, subtitle, meetingTime, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Meeting title is required" });
    }

    const meeting = await Meeting.create({
      title,
      subtitle,
      meetingTime,
      status: status || "Pending",
      ownerId: req.user.id,
    });

    return res.status(201).json({ success: true, meeting });
  } catch (error) {
    console.error("Create meeting error:", error);
    return res.status(500).json({ success: false, message: "Server error creating meeting" });
  }
};

// PATCH /api/meetings/:id
const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ where: { id: req.params.id, ownerId: req.user.id } });

    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    const { title, subtitle, meetingTime, status } = req.body;
    if (title !== undefined) meeting.title = title;
    if (subtitle !== undefined) meeting.subtitle = subtitle;
    if (meetingTime !== undefined) meeting.meetingTime = meetingTime;
    if (status !== undefined) meeting.status = status;

    await meeting.save();

    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    console.error("Update meeting error:", error);
    return res.status(500).json({ success: false, message: "Server error updating meeting" });
  }
};

module.exports = { getMeetings, createMeeting, updateMeeting };
