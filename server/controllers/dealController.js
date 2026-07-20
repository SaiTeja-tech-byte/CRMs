const Deal = require("../models/Deal");
const { logActivity } = require("./activityController");

// GET /api/deals
const getDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, deals });
  } catch (error) {
    console.error("Get deals error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching deals" });
  }
};

// POST /api/deals
const createDeal = async (req, res) => {
  try {
    const { title, value, stage, tag } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Deal title is required" });
    }

    const deal = await Deal.create({
      title,
      value: value || 0,
      stage: stage || "Leads",
      tag,
      ownerId: req.user.id,
    });

    await logActivity(req.user.id, `${title} added by ${req.user.fullName}`);

    return res.status(201).json({ success: true, deal });
  } catch (error) {
    console.error("Create deal error:", error);
    return res.status(500).json({ success: false, message: "Server error creating deal" });
  }
};

// PATCH /api/deals/:id
// Used for editing a deal, and specifically for drag-and-drop stage changes
const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findOne({ where: { id: req.params.id, ownerId: req.user.id } });

    if (!deal) {
      return res.status(404).json({ success: false, message: "Deal not found" });
    }

    const { title, value, stage, tag } = req.body;
    if (title !== undefined) deal.title = title;
    if (value !== undefined) deal.value = value;
    if (stage !== undefined && stage !== deal.stage) {
      deal.stage = stage;
      await logActivity(req.user.id, `${deal.title} Deal stage moved to ${stage}`);
    }
    if (tag !== undefined) deal.tag = tag;

    await deal.save();

    return res.status(200).json({ success: true, deal });
  } catch (error) {
    console.error("Update deal error:", error);
    return res.status(500).json({ success: false, message: "Server error updating deal" });
  }
};

// DELETE /api/deals/:id
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findOne({ where: { id: req.params.id, ownerId: req.user.id } });

    if (!deal) {
      return res.status(404).json({ success: false, message: "Deal not found" });
    }

    await deal.destroy();

    return res.status(200).json({ success: true, message: "Deal deleted" });
  } catch (error) {
    console.error("Delete deal error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting deal" });
  }
};

module.exports = { getDeals, createDeal, updateDeal, deleteDeal };
