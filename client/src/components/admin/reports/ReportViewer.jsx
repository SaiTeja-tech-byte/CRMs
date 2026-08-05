import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportViewer = ({ type, filters, data, onBack }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const getTitle = () => {
    switch(type) {
      case "attendance": return "ATTENDANCE REPORT";
      case "payroll": return "PAYROLL REPORT";
      case "expenses": return "EXPENSES REPORT";
      case "helpCenter": return "HELP CENTER REPORT";
      case "tasks": return "TASKS REPORT";
      case "employees": return "EMPLOYEES REPORT";
      case "organization": return "ORGANIZATION REPORT";
      default: return "REPORT";
    }
  };

  const getSubtitle = () => {
    if (type === "payroll") {
      const m = new Date(0, (filters.month || 1) - 1).toLocaleString('default', { month: 'long' });
      return `For The Month Of ${m} ${filters.year || new Date().getFullYear()}`;
    }
    if (type === "employees" || type === "organization") {
      return `Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
    const f = filters.from || "Beginning";
    const t = filters.to || "Today";
    return `From The Date Of ${f} To ${t}`;
  };

  const getColumns = () => {
    switch(type) {
      case "attendance": return ["Employee", "Employee ID", "Department", "Date", "Check In", "Check Out", "Working Hours", "Break", "Status"];
      case "payroll": return ["Employee", "Department", "Month", "Basic Salary", "Allowances", "Deductions", "Net Salary", "Status"];
      case "expenses": return ["Employee", "Department", "Category", "Amount", "Date", "Status"];
      case "helpCenter": return ["Ticket ID", "Subject", "Employee", "Priority", "Status", "Created Date", "Closed Date"];
      case "tasks": return ["Employee", "Task", "Priority", "Due Date", "Status", "Completion %"];
      case "employees": return ["Employee ID", "Employee", "Department", "Designation", "Joined Date", "Status"];
      case "organization": return ["Metric", "Value"];
      default: return [];
    }
  };

  const getRowData = (r) => {
    switch(type) {
      case "attendance": return [r.employeeName, r.employeeId, r.department, r.date, r.checkIn, r.checkOut, r.workingHours, r.breakTime, r.status];
      case "payroll": return [r.employeeName, r.department, `${r.month}/${r.year}`, `$${r.basicSalary}`, `$${r.allowances}`, `$${r.deductions}`, `$${r.netSalary}`, r.status];
      case "expenses": return [r.employeeName, r.department, r.category, `$${r.amount}`, r.date, r.status];
      case "helpCenter": return [r.id?.split("-")[0] || "-", r.subject, r.employeeName, r.priority, r.status, r.createdDate, r.closedDate];
      case "tasks": return [r.employeeName, r.title, r.priority, r.dueDate, r.status, r.completion];
      case "employees": return [r.employeeId, r.employeeName, r.department, r.designation, r.joinedDate, r.employmentStatus];
      case "organization": return [r.metric, r.value];
      default: return [];
    }
  };

  const columns = getColumns();
  const body = data.map(getRowData);

  const exportPdf = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text(getTitle(), 14, 20);
    doc.setFontSize(12);
    doc.text(getSubtitle(), 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [columns],
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save(`${type}-report-${Date.now()}.pdf`);
  };

  const exportCsv = () => {
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = body.map(row => row.map(escape).join(","));
    const csv = [columns.join(","), ...lines].join("\n");
    
    const url = window.URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const thStyle = { padding: "12px 16px", fontWeight: "600", color: "#fff", background: "#1e3a8a", border: "1px solid #cbd5e1", whiteSpace: "nowrap" };
  const tdStyle = { padding: "12px 16px", border: "1px solid #cbd5e1", color: "#334155" };

  return (
    <div style={{ padding: "32px", width: "100%", opacity: show ? 1 : 0, transition: "opacity 0.3s ease", background: "#f5f7fb", minHeight: "100vh" }}>
      
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>{getTitle()}</h4>
          <span style={{ color: "#94a3b8" }}>|</span>
          <span style={{ fontSize: "14px", color: "#64748b" }}>{getSubtitle()}</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={printReport} style={{ padding: "6px 16px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: "500", color: "#475569" }}>Print</button>
          <button onClick={exportPdf} style={{ padding: "6px 16px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: "500", color: "#475569" }}>PDF</button>
          <button onClick={exportCsv} style={{ padding: "6px 16px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: "500", color: "#475569" }}>Excel / CSV</button>
          <button onClick={onBack} style={{ padding: "6px 16px", borderRadius: "4px", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: "600" }}>Back</button>
        </div>
      </div>

      {/* Data Table */}
      {data.length === 0 ? (
        <div style={{ background: "#fff", padding: "64px 32px", textAlign: "center", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <i className="bi bi-folder2-open" style={{ fontSize: "48px", color: "#94a3b8", marginBottom: "16px", display: "block" }}></i>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#334155", margin: "0 0 8px 0" }}>No records found for the selected filters.</h3>
          <p style={{ color: "#64748b", margin: 0 }}>Try adjusting your date range or changing your filters.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={tdStyle}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ReportViewer;
