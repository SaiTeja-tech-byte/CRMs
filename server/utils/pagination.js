
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;

const parsePagination = (query, { sortableFields = [], defaultSort = "createdAt", defaultOrder = "DESC" } = {}) => {
  let page = parseInt(query.page, 10);
  if (!Number.isFinite(page) || page < 1) page = 1;

  let limit = parseInt(query.limit, 10);
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  const sortBy = sortableFields.includes(query.sortBy) ? query.sortBy : defaultSort;
  const sortDir = String(query.sortDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const dir = query.sortDir ? sortDir : defaultOrder;

  return { page, limit, offset, order: [[sortBy, dir]] };
};


const buildPaginationMeta = (count, page, limit) => ({
  page,
  limit,
  total: count,
  totalPages: Math.max(1, Math.ceil(count / limit)),
});

module.exports = { parsePagination, buildPaginationMeta, DEFAULT_LIMIT, MAX_LIMIT };
