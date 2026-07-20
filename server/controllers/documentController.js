const Document = require("../models/Document");
const { emitToAll } = require("../utils/socket");

// GET /api/documents — any logged-in user (employee or admin) can view.
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching documents" });
  }
};

// POST /api/documents
// body: { name, fileUrl, extension, category, department, size, visibility }
// fileUrl is expected to already be a hosted URL or base64 data URL — this
// endpoint stores metadata only, it doesn't handle raw file upload/storage.
const createDocument = async (req, res) => {
  try {
    const { name, fileUrl, extension, category, department, size, visibility } = req.body;

    if (!name || !fileUrl) {
      return res.status(400).json({ success: false, message: "name and fileUrl are required" });
    }

    const document = await Document.create({
      name,
      fileUrl,
      extension,
      category,
      department,
      size,
      visibility,
      uploadedById: req.user.id,
      uploadedByName: req.user.fullName,
    });

    emitToAll("document:new", { document });
    return res.status(201).json({ success: true, document });
  } catch (error) {
    console.error("Create document error:", error);
    return res.status(500).json({ success: false, message: "Server error creating document" });
  }
};

// DELETE /api/documents/:id — the uploader or an admin can delete.
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const isOwner = document.uploadedById === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "You can't delete this document" });
    }

    await document.destroy();
    emitToAll("document:deleted", { id: req.params.id });
    return res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting document" });
  }
};

module.exports = { getDocuments, createDocument, deleteDocument };
