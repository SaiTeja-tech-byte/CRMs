import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

// Page/limit control bar for any server-paginated list. Expects the
// { page, limit, total, totalPages } shape returned by
// server/utils/pagination.js's buildPaginationMeta().
//
// Usage:
//   <PaginationBar pagination={pagination} onPageChange={(p) => setPage(p)} />
export const PaginationBar = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Compact page-number list: first, last, current +/-1, with ellipses —
  // avoids rendering 50 page buttons for a large table.
  const pageNumbers = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pageNumbers.push(p);
    else if (pageNumbers[pageNumbers.length - 1] !== "...") pageNumbers.push("...");
  }

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
      <div className="text-muted small">
        Showing {from}–{to} of {total}
      </div>
      <div className="d-flex align-items-center gap-1">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-muted">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${p === page ? "btn-brand" : "btn-outline-secondary"}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Clickable <th> that toggles sort direction and shows the current sort
// state. Lives in the same file since the two are almost always used
// together, but can be imported independently.
//
// Usage:
//   <SortableHeader label="Name" field="fullName" sort={sort} onSort={setSort} />
// where `sort` is { sortBy, sortDir } and onSort receives the next { sortBy, sortDir }.
export const SortableHeader = ({ label, field, sort, onSort, className = "", style = {} }) => {
  const isActive = sort?.sortBy === field;
  const nextDir = isActive && sort.sortDir === "asc" ? "desc" : "asc";

  const Icon = !isActive ? ArrowUpDown : sort.sortDir === "asc" ? ArrowUp : ArrowDown;

  return (
    <th
      className={`${className}`}
      style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", ...style }}
      onClick={() => onSort({ sortBy: field, sortDir: nextDir })}
    >
      <span className="d-inline-flex align-items-center gap-1">
        {label}
        <Icon size={12} opacity={isActive ? 1 : 0.4} />
      </span>
    </th>
  );
};
