import React from "react";

const DEPARTMENTS = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Product"];
const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const TASK_STATUSES = ["Pending", "In Progress", "Completed"];

const ReportModal = ({
  type, // "attendance" | "payroll" | "expenses" | "helpCenter" | "tasks"
  isAdmin,
  filters,
  setFilters,
  onClose,
  onLaunch
}) => {
  if (!type) return null;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getTitle = () => {
    switch(type) {
      case "attendance": return "Attendance Report";
      case "payroll": return "Payroll Report";
      case "expenses": return "Expenses Report";
      case "helpCenter": return "Help Center Report";
      case "tasks": return "Tasks Report";
      default: return "Report";
    }
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }} onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "500px", zIndex: 1050, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px" }}>
          <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>{getTitle()}</h4>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: "#64748b", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Date Range (Used for most reports except Payroll) */}
          {type !== "payroll" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>From Date</label>
                <input type="date" name="from" value={filters.from || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>To Date</label>
                <input type="date" name="to" value={filters.to || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
              </div>
            </>
          )}

          {/* Month / Year for Payroll */}
          {type === "payroll" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Month</label>
                <select name="month" value={filters.month || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Year</label>
                <select name="year" value={filters.year || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </>
          )}

          {/* Admin Specific Filters */}
          {isAdmin && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px", borderTop: "1px dashed #e2e8f0", paddingTop: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Employee Name</label>
                <input type="text" name="name" value={filters.name || ""} onChange={handleChange} placeholder="Optional" style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Department</label>
                <select name="department" value={filters.department || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}>
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Type Specific Additional Filters */}
          {type === "helpCenter" && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Ticket Status</label>
              <select name="status" value={filters.status || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}>
                <option value="">All Statuses</option>
                {TICKET_STATUSES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          {type === "tasks" && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label style={{ width: "120px", fontSize: "14px", fontWeight: "500", color: "#475569" }}>Task Status</label>
              <select name="status" value={filters.status || ""} onChange={handleChange} style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}>
                <option value="">All Statuses</option>
                {TASK_STATUSES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#f1f5f9", color: "#475569", fontWeight: "500", cursor: "pointer" }}>Cancel</button>
          <button onClick={onLaunch} style={{ padding: "8px 24px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "600", cursor: "pointer" }}>Launch</button>
        </div>

      </div>
    </>
  );
};

export default ReportModal;
