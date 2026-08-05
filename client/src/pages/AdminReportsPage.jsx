import React, { useState } from "react";
import reportService from "../services/reportService";

const today = () => new Date().toISOString().slice(0, 10);
const firstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const currentMonth = () => {
  const d = new Date();
  return d.getMonth() + 1;
};
const currentYear = () => {
  const d = new Date();
  return d.getFullYear();
};

const DEPARTMENTS = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Product"];
const STATUSES = ["Active", "Inactive", "On Leave", "Suspended"];

const AdminReportsPage = () => {
  // Employee Filters
  const [empDepartment, setEmpDepartment] = useState("");
  const [empStatus, setEmpStatus] = useState("");

  // Attendance Filters
  const [attendanceFrom, setAttendanceFrom] = useState(firstDayOfMonth());
  const [attendanceTo, setAttendanceTo] = useState(today());

  // Payroll Filters
  const [payrollMonth, setPayrollMonth] = useState(currentMonth());
  const [payrollYear, setPayrollYear] = useState(currentYear());

  // Expenses Filters
  const [expensesFrom, setExpensesFrom] = useState(firstDayOfMonth());
  const [expensesTo, setExpensesTo] = useState(today());

  // Help Center Filters
  const [helpCenterStatus, setHelpCenterStatus] = useState("");

  const [generatedReports, setGeneratedReports] = useState([
    { id: 1, name: "Employees Report", date: "05 Aug 2026", format: "Excel" },
    { id: 2, name: "Attendance Report", date: "04 Aug 2026", format: "PDF" },
    { id: 3, name: "Payroll Report", date: "01 Aug 2026", format: "Excel" },
    { id: 4, name: "Expense Report", date: "01 Aug 2026", format: "PDF" },
  ]);

  const [loadingType, setLoadingType] = useState("");

  const handleGenerateAttendance = async () => {
    try {
      setLoadingType("attendance");
      await reportService.downloadAttendanceCsv({ from: attendanceFrom, to: attendanceTo });
      
      const newReport = {
        id: Date.now(),
        name: "Attendance Report",
        date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
        format: "Excel"
      };
      setGeneratedReports([newReport, ...generatedReports]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate attendance report");
    } finally {
      setLoadingType("");
    }
  };

  const handleMockGenerate = (type) => {
    alert(`${type} report generation will be available soon.`);
  };

  const thStyle = { padding: "16px 24px", fontWeight: "600", color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
  const tdStyle = { padding: "16px 24px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
  const inputStyle = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#0f172a" };
  const primaryBtn = { padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer", border: "1px solid transparent", background: "#2563eb", color: "#fff" };

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Generate organization reports.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "32px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={thStyle}>Report Type</th>
              <th style={thStyle}>Filters</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Employees</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <select style={inputStyle} value={empDepartment} onChange={(e) => setEmpDepartment(e.target.value)}>
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select style={inputStyle} value={empStatus} onChange={(e) => setEmpStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleMockGenerate("Employees")} style={primaryBtn}>Generate</button>
              </td>
            </tr>

            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Attendance</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input type="date" style={inputStyle} value={attendanceFrom} onChange={(e) => setAttendanceFrom(e.target.value)} />
                  <span style={{ color: "#94a3b8" }}>to</span>
                  <input type="date" style={inputStyle} value={attendanceTo} onChange={(e) => setAttendanceTo(e.target.value)} />
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={handleGenerateAttendance} style={primaryBtn} disabled={loadingType === "attendance"}>Generate</button>
              </td>
            </tr>
            
            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Payroll</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <select style={inputStyle} value={payrollMonth} onChange={(e) => setPayrollMonth(e.target.value)}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                  <select style={inputStyle} value={payrollYear} onChange={(e) => setPayrollYear(e.target.value)}>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleMockGenerate("Payroll")} style={primaryBtn}>Generate</button>
              </td>
            </tr>

            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Expenses</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input type="date" style={inputStyle} value={expensesFrom} onChange={(e) => setExpensesFrom(e.target.value)} />
                  <span style={{ color: "#94a3b8" }}>to</span>
                  <input type="date" style={inputStyle} value={expensesTo} onChange={(e) => setExpensesTo(e.target.value)} />
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleMockGenerate("Expenses")} style={primaryBtn}>Generate</button>
              </td>
            </tr>

            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Help Center</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <select style={inputStyle} value={helpCenterStatus} onChange={(e) => setHelpCenterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleMockGenerate("Help Center")} style={primaryBtn}>Generate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Generated Reports</h3>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={thStyle}>Report Name</th>
              <th style={thStyle}>Generated On</th>
              <th style={thStyle}>Format</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {generatedReports.map((report) => (
              <tr key={report.id}>
                <td style={{ ...tdStyle, fontWeight: "500", color: "#334155" }}>{report.name}</td>
                <td style={tdStyle}>{report.date}</td>
                <td style={tdStyle}>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", background: report.format === "PDF" ? "#fee2e2" : "#dcfce7", color: report.format === "PDF" ? "#b91c1c" : "#16a34a" }}>
                    {report.format}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => alert("Downloading past report...")} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "14px", fontWeight: "500", padding: 0 }}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
            {generatedReports.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No generated reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportsPage;
