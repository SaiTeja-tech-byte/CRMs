// Shared pagination + sorting helper for list endpoints.
//
// Usage in a controller:
//   const { parsePagination, buildPaginationMeta } = require("../utils/pagination");
//   const { limit, offset, page, order } = parsePagination(req.query, {
//     sortableFields: ["fullName", "createdAt", "department"],
//     defaultSort: "createdAt",
//     defaultOrder: "DESC",
//   });
//   const { rows, count } = await User.findAndCountAll({ where, order, limit, offset });
//   return res.status(200).json({ success: true, users: rows, pagination: buildPaginationMeta(count, page, limit) });
//
// Query params it understands: ?page=1&limit=20&sortBy=fullName&sortDir=asc

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Turns req.query into Sequelize-ready { limit, offset, page, order }.
// sortableFields is a whitelist — anything else in sortBy is ignored rather
// than passed straight into an ORDER BY, since that's user input.
const parsePagination = (query, { sortableFields = [], defaultSort = "createdAt", defaultOrder = "DESC" } = {}) => {
  let page = parseInt(query.page, 10);
  if (!Number.isFinite(page) || page < 1) page = 1;

  let limit = parseInt(query.limit, 10);
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  const sortBy = sortableFields.includes(query.sortBy) ? query.sortBy : defaultSort;
  const sortDir = String(query.sortDir).toUpperCase() === "ASC" ? "ASC" : "DESC";
  // Fall back to defaultOrder only when sortDir wasn't actually provided.
  const dir = query.sortDir ? sortDir : defaultOrder;

  return { page, limit, offset, order: [[sortBy, dir]] };
};

// Builds the { pagination } metadata block every paginated endpoint returns
// alongside its existing entity-specific key (e.g. { success, users, pagination }
// rather than a generic "rows" key) — that way responses stay backward
// compatible with any caller that isn't updated to use pagination yet.
const buildPaginationMeta = (count, page, limit) => ({
  page,
  limit,
  total: count,
  totalPages: Math.max(1, Math.ceil(count / limit)),
});

module.exports = { parsePagination, buildPaginationMeta, DEFAULT_LIMIT, MAX_LIMIT };
