// Must be used AFTER requireAuth on a route — it relies on req.user
// already being populated (see middleware/authMiddleware.js).
//
// Usage:
//   router.use(requireAuth, requireAdmin);
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

module.exports = requireAdmin;
