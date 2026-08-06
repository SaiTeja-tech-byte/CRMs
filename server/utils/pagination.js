
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



const REPORT_PAGE_SIZE = 8;

const DEFAULT_DIRECTION = { name: "asc", newest: "desc", oldest: "asc", size: "desc" };

const sortReportRows = (rows, sortBy, order, sortMap = {}) => {
  const field = sortMap[sortBy];
  if (!field) return rows;

  const dir = String(order || DEFAULT_DIRECTION[sortBy] || "asc").toLowerCase() === "desc" ? -1 : 1;

  return [...rows].sort((a, b) => {
    let va = a ? a[field] : undefined;
    let vb = b ? b[field] : undefined;
    if (va === undefined || va === null) va = "";
    if (vb === undefined || vb === null) vb = "";

    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * dir;
    }

    const looksLikeDate = va instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(va));
    if (looksLikeDate) {
      const da = new Date(va).getTime();
      const db = new Date(vb).getTime();
      if (!Number.isNaN(da) && !Number.isNaN(db)) return (da - db) * dir;
    }

    return String(va).localeCompare(String(vb), undefined, { sensitivity: "base" }) * dir;
  });
};

const paginateReportRows = (rows, page, limit) => {
  // limit=all bypasses pagination entirely — used for CSV/PDF/print export,
  // which needs the complete matching result set, not just one page.
  if (String(limit).toLowerCase() === "all") {
    return { rows, pagination: { page: 1, limit: rows.length || 1, total: rows.length, totalPages: 1 } };
  }

  let p = parseInt(page, 10);
  if (!Number.isFinite(p) || p < 1) p = 1;

  let l = parseInt(limit, 10);
  if (!Number.isFinite(l) || l < 1) l = REPORT_PAGE_SIZE;

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / l));
  if (p > totalPages) p = totalPages;

  const offset = (p - 1) * l;
  const paged = rows.slice(offset, offset + l);

  return { rows: paged, pagination: { page: p, limit: l, total, totalPages } };
};


const sortAndPaginateReport = (rows, query, sortMap) => {
  const { sortBy, order, page, limit } = query || {};
  const sorted = sortReportRows(rows, sortBy, order, sortMap);
  return paginateReportRows(sorted, page, limit);
};

module.exports = {
  parsePagination,
  buildPaginationMeta,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  REPORT_PAGE_SIZE,
  sortReportRows,
  paginateReportRows,
  sortAndPaginateReport,
};
