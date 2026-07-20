const ActivityLog = require("../models/ActivityLog");


const getActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.findAll({
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    return res.status(200).json({ success: true, activity });
  } catch (error) {
    console.error("Get activity error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching activity" });
  }
};

// Reusable helper — call this from other controllers whenever something
// worth showing on the timeline happens (e.g. after Deal.create()).
// Not a route itself, just a plain function other controllers import.
const logActivity = async (actorId, message) => {
  try {
    await ActivityLog.create({ actorId, message });
  } catch (error) {
    // Never let a logging failure break the main action (e.g. creating a deal)
    console.error("Failed to log activity:", error.message);
  }
};

module.exports = { getActivity, logActivity };
