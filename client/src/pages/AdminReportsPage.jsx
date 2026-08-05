import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import reportService from "../services/reportService";

const REPORT_CARDS = [
  { key: "attendance", label: "Attendance Report", icon: "bi-calendar-check", desc: "Search any employee's attendance, or pull a company-wide view.", active: true },
  { key: "working-hours", label: "Working Hours", icon: "bi-clock-history", desc: "Daily working & break time breakdown.", active: false },
  { key: "task", label: "Task Report", icon: "bi-check2-square", desc: "Assigned vs completed vs pending tasks.", active: false },
  { key: "expense", label: "Expense Report", icon: "bi-receipt", desc: "Available under the Expenses tab.", active: false },
  { key: "payroll", label: "Payroll Report", icon: "bi-cash-coin", desc: "Available under the Payroll tab.", active: false },
  { key: "leave", label: "Leave Report", icon: "bi-airplane", desc: "Company-wide leave history.", active: false },
  { key: "department", label: "Department Report", icon: "bi-diagram-3", desc: "Attendance % and avg. working hours by department.", active: false },
];

const DEPARTMENTS = ["Engineering", "Product", "Marketing", "Sales", "HR", "Finance"];

const firstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

const StatusBadge = ({ status }) => {
  const map = {
    Working: "bg-primary", "On Break": "bg-info text-dark", Completed: "bg-success",
    Absent: "bg-secondary", Late: "bg-warning text-dark",
  };
  return <span className={`badge rounded-pill ${map[status] || "bg-light text-dark border"}`}>{status}</span>;
};

const AdminReportsPage = () => {
  const [view, setView] = useState("hub"); // "hub" | "attendance"
  const [from, setFrom] = useState(firstDayOfMonth());
  const [to, setTo] = useState(today());
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const filters = { from, to, name: name || undefined, employeeId: employeeId || undefined, department: department || undefined };

  const generate = async () => {
    try {
      setLoading(true);
      const res = await reportService.getAttendanceReport(filters);
      if (res.success) {
        setRows(res.rows);
        setSummary(res.summary);
        setGenerated(true);
      }
    } catch (err) {
      console.error("Failed to generate attendance report", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => reportService.downloadAttendanceCsv(filters);

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Attendance Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Period: ${from} to ${to}`, 14, 23);
    autoTable(doc, {
      startY: 28,
      head: [["Emp ID", "Name", "Dept", "Date", "Check In", "Check Out", "Working Hrs", "Status"]],
      body: rows.map((r) => [r.employeeId, r.employeeName, r.department, r.date, r.checkIn, r.checkOut, r.workingHours, r.status]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save(`attendance-report-${Date.now()}.pdf`);
  };

  if (view === "hub") {
    return (
      <div className="container-fluid p-4">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Reports</h4>
          <p className="text-muted mb-0 small">Search and generate reports for any employee or department.</p>
        </div>
        <div className="row g-3">
          {REPORT_CARDS.map((c) => (
            <div className="col-12 col-sm-6 col-lg-4" key={c.key}>
              <div className={`card border-0 shadow-sm rounded-3 h-100 ${!c.active ? "opacity-75" : ""}`}>
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: 36, height: 36 }}>
                      <i className={`bi ${c.icon}`}></i>
                    </span>
                    <h6 className="fw-bold mb-0">{c.label}</h6>
                  </div>
                  <p className="small text-muted flex-grow-1">{c.desc}</p>
                  <button
                    className={`btn btn-sm ${c.active ? "btn-primary" : "btn-light border text-muted"}`}
                    disabled={!c.active}
                    onClick={() => c.active && setView(c.key)}
                  >
                    {c.active ? "Generate Report" : "Coming soon"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-sm btn-light border mb-2" onClick={() => setView("hub")}>
            <i className="bi-arrow-left me-1"></i> Back to Reports
          </button>
          <h4 className="fw-bold mb-1">Attendance Report</h4>
          <p className="text-muted mb-0 small">Leave the search fields empty to pull attendance for every employee.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 mb-3">
        <div className="card-body p-3 d-flex flex-wrap align-items-end gap-3">
          <div>
            <label className="form-label small text-muted mb-1">Employee Name</label>
            <input type="text" className="form-control form-control-sm" style={{ width: 180 }} placeholder="e.g. Sai Teja" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label small text-muted mb-1">Employee ID</label>
            <input type="text" className="form-control form-control-sm" style={{ width: 140 }} placeholder="e.g. EMP001" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
          </div>
          <div>
            <label className="form-label small text-muted mb-1">Department</label>
            <select className="form-select form-select-sm" style={{ width: 160 }} value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label small text-muted mb-1">From</label>
            <input type="date" className="form-control form-control-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="form-label small text-muted mb-1">To</label>
            <input type="date" className="form-control form-control-sm" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button className="btn btn-sm btn-primary" onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
          {generated && rows.length > 0 && (
            <div className="ms-auto d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={downloadCsv}>
                <i className="bi-filetype-csv me-1"></i> CSV
              </button>
              <button className="btn btn-sm btn-light border" onClick={downloadPdf}>
                <i className="bi-file-earmark-pdf me-1"></i> PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {summary && (
        <div className="row g-3 mb-3">
          {[
            { label: "Total Records", value: summary.totalRecords },
            { label: "Present", value: summary.present },
            { label: "Absent", value: summary.absent },
            { label: "Late", value: summary.late },
          ].map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="card border-0 shadow-sm rounded-2">
                <div className="card-body p-3">
                  <div className="text-muted small">{s.label}</div>
                  <div className="fs-5 fw-bold">{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="ps-4 fw-medium border-0">Emp ID</th>
                  <th className="fw-medium border-0">Name</th>
                  <th className="fw-medium border-0">Department</th>
                  <th className="fw-medium border-0">Date</th>
                  <th className="fw-medium border-0">Check In</th>
                  <th className="fw-medium border-0">Check Out</th>
                  <th className="fw-medium border-0">Working Hours</th>
                  <th className="pe-4 fw-medium border-0">Status</th>
                </tr>
              </thead>
              <tbody>
                {generated && rows.length === 0 && (
                  <tr><td colSpan="8" className="text-center py-5 text-muted small">No attendance records match these filters.</td></tr>
                )}
                {!generated && (
                  <tr><td colSpan="8" className="text-center py-5 text-muted small">Set your filters and click Generate Report.</td></tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="ps-4 small">{r.employeeId}</td>
                    <td className="small fw-medium">{r.employeeName}</td>
                    <td className="small">{r.department}</td>
                    <td className="small">{r.date}</td>
                    <td className="small">{r.checkIn}</td>
                    <td className="small">{r.checkOut}</td>
                    <td className="small fw-medium">{r.workingHours}</td>
                    <td className="pe-4"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
