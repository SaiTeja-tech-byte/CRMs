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

const ReportsPage = () => {
  const [attendanceFrom, setAttendanceFrom] = useState(firstDayOfMonth());
  const [attendanceTo, setAttendanceTo] = useState(today());
  const [payrollMonth, setPayrollMonth] = useState(currentMonth());
  const [payrollYear, setPayrollYear] = useState(currentYear());
  const [expensesFrom, setExpensesFrom] = useState(firstDayOfMonth());
  const [expensesTo, setExpensesTo] = useState(today());
  const [tasksFrom, setTasksFrom] = useState(firstDayOfMonth());
  const [tasksTo, setTasksTo] = useState(today());

  const [recentReports, setRecentReports] = useState([
    { id: 1, name: "Attendance Report", date: "05 Aug 2026", format: "PDF" },
    { id: 2, name: "Expense Report", date: "03 Aug 2026", format: "Excel" },
  ]);

  const [loadingType, setLoadingType] = useState("");

  const handleGenerateAttendance = async (format) => {
    try {
      setLoadingType(`attendance_${format}`);
      if (format === "csv") {
        await reportService.downloadAttendanceCsv({ from: attendanceFrom, to: attendanceTo });
      } else {
        // Mock PDF generation for now
        alert("PDF Generation is being handled by backend. Please use Excel/CSV for now.");
      }
      
      const newReport = {
        id: Date.now(),
        name: "Attendance Report",
        date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
        format: format === "csv" ? "Excel" : "PDF"
      };
      setRecentReports([newReport, ...recentReports]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoadingType("");
    }
  };

  const handleMockGenerate = (type, format) => {
    alert(`${type} report generation will be available soon.`);
  };

  const thStyle = { padding: "16px 24px", fontWeight: "600", color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
  const tdStyle = { padding: "16px 24px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
  const inputStyle = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#0f172a" };
  const btnStyle = { padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer", border: "1px solid transparent" };
  const primaryBtn = { ...btnStyle, background: "#2563eb", color: "#fff" };
  const secondaryBtn = { ...btnStyle, background: "#fff", color: "#2563eb", border: "1px solid #bfdbfe" };

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Generate and download your reports.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "32px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={thStyle}>Report Type</th>
              <th style={thStyle}>Date Range / Filters</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
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
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleGenerateAttendance("pdf")} style={primaryBtn} disabled={loadingType === "attendance_pdf"}>Generate PDF</button>
                  <button onClick={() => handleGenerateAttendance("csv")} style={secondaryBtn} disabled={loadingType === "attendance_csv"}>Generate Excel</button>
                </div>
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
                <button onClick={() => handleMockGenerate("Payroll", "pdf")} style={primaryBtn}>Download Payslip</button>
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
                <button onClick={() => handleMockGenerate("Expenses", "pdf")} style={primaryBtn}>Generate PDF</button>
              </td>
            </tr>

            <tr>
              <td style={{ ...tdStyle, fontWeight: "600", color: "#334155" }}>Tasks</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input type="date" style={inputStyle} value={tasksFrom} onChange={(e) => setTasksFrom(e.target.value)} />
                  <span style={{ color: "#94a3b8" }}>to</span>
                  <input type="date" style={inputStyle} value={tasksTo} onChange={(e) => setTasksTo(e.target.value)} />
                </div>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleMockGenerate("Tasks", "excel")} style={secondaryBtn}>Generate Excel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Recent Reports</h3>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={thStyle}>Report Name</th>
              <th style={thStyle}>Generated On</th>
              <th style={thStyle}>Format</th>
              <th style={thStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((report) => (
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
            {recentReports.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No recent reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
