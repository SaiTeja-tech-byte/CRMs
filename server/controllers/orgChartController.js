const OrgChartNode = require("../models/OrgChartNode");
const { emitToAll } = require("../utils/socket");

// Turns the flat table into a nested tree. Root nodes (parentId === null)
// come back as top-level entries, each with a `children` array built the
// same way, recursively.
const buildTree = (nodes) => {
  const byParent = {};
  nodes.forEach((n) => {
    const key = n.parentId || "root";
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(n);
  });

  Object.values(byParent).forEach((list) => list.sort((a, b) => a.order - b.order || new Date(a.createdAt) - new Date(b.createdAt)));

  const attachChildren = (node) => ({
    ...node.toJSON(),
    children: (byParent[node.id] || []).map(attachChildren),
  });

  return (byParent.root || []).map(attachChildren);
};

// Collects every descendant id of a node (used to block a move that would
// create a cycle, e.g. dragging a manager under their own report).
const collectDescendantIds = (allNodes, rootId) => {
  const ids = new Set();
  const walk = (id) => {
    allNodes
      .filter((n) => n.parentId === id)
      .forEach((child) => {
        ids.add(child.id);
        walk(child.id);
      });
  };
  walk(rootId);
  return ids;
};

// GET /api/org-chart — read-only, any authenticated user (employee or admin).
const getOrgChart = async (req, res) => {
  try {
    const nodes = await OrgChartNode.findAll({ order: [["order", "ASC"], ["createdAt", "ASC"]] });
    return res.status(200).json({ success: true, tree: buildTree(nodes), totalEmployees: nodes.length });
  } catch (error) {
    console.error("Get org chart error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching organization chart" });
  }
};

// POST /api/org-chart — admin only. body: { name, title, department, email,
// phone, avatarUrl, userId, parentId }. parentId omitted/null = a new root box.
const createNode = async (req, res) => {
  try {
    const { name, title, department, email, phone, avatarUrl, userId, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    if (parentId) {
      const parent = await OrgChartNode.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ success: false, message: "Parent node not found" });
      }
    }

    const siblingCount = await OrgChartNode.count({ where: { parentId: parentId || null } });

    const node = await OrgChartNode.create({
      name: name.trim(),
      title: title || null,
      department: department || null,
      email: email || null,
      phone: phone || null,
      avatarUrl: avatarUrl || null,
      userId: userId || null,
      parentId: parentId || null,
      order: siblingCount,
    });

    emitToAll("orgchart:updated", { type: "created", node });
    return res.status(201).json({ success: true, node });
  } catch (error) {
    console.error("Create org chart node error:", error);
    return res.status(500).json({ success: false, message: "Server error adding to organization chart" });
  }
};

// PATCH /api/org-chart/:id — admin only. Any subset of the editable fields,
// including parentId to move the node elsewhere in the tree.
const updateNode = async (req, res) => {
  try {
    const node = await OrgChartNode.findByPk(req.params.id);
    if (!node) {
      return res.status(404).json({ success: false, message: "Node not found" });
    }

    const editable = ["name", "title", "department", "email", "phone", "avatarUrl", "userId"];
    for (const field of editable) {
      if (req.body[field] !== undefined) node[field] = req.body[field] || null;
    }

    if (req.body.parentId !== undefined) {
      const newParentId = req.body.parentId || null;

      if (newParentId === node.id) {
        return res.status(400).json({ success: false, message: "A node can't report to itself" });
      }

      if (newParentId) {
        const allNodes = await OrgChartNode.findAll();
        const descendantIds = collectDescendantIds(allNodes, node.id);
        if (descendantIds.has(newParentId)) {
          return res.status(400).json({ success: false, message: "Can't move a node under its own report" });
        }
        const newParent = await OrgChartNode.findByPk(newParentId);
        if (!newParent) {
          return res.status(404).json({ success: false, message: "Parent node not found" });
        }
      }

      node.parentId = newParentId;
    }

    await node.save();
    emitToAll("orgchart:updated", { type: "updated", node });
    return res.status(200).json({ success: true, node });
  } catch (error) {
    console.error("Update org chart node error:", error);
    return res.status(500).json({ success: false, message: "Server error updating organization chart" });
  }
};

// DELETE /api/org-chart/:id — admin only. Removing a node re-parents its
// direct reports up to the deleted node's own parent (or to the top level,
// if it was a root) so the rest of the tree stays intact instead of
// vanishing along with it.
const deleteNode = async (req, res) => {
  try {
    const node = await OrgChartNode.findByPk(req.params.id);
    if (!node) {
      return res.status(404).json({ success: false, message: "Node not found" });
    }

    await OrgChartNode.update({ parentId: node.parentId }, { where: { parentId: node.id } });
    await node.destroy();

    emitToAll("orgchart:updated", { type: "deleted", id: req.params.id });
    return res.status(200).json({ success: true, message: "Removed from organization chart" });
  } catch (error) {
    console.error("Delete org chart node error:", error);
    return res.status(500).json({ success: false, message: "Server error removing from organization chart" });
  }
};

module.exports = { getOrgChart, createNode, updateNode, deleteNode };
