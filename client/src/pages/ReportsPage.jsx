import React, { useState } from "react";
import reportService from "../services/reportService";
import ReportModal from "../components/admin/reports/ReportModal";
import ReportViewer from "../components/admin/reports/ReportViewer";

const REPORT_CARDS = [
  { key: "attendance", label: "Attendance Report", icon: "bi-calendar-check", desc: "View your check-in, check-out, and working hours.", date: "05 Aug 2026" },
  { key: "payroll", label: "Payroll Report", icon: "bi-cash-coin", desc: "View your monthly salary and deductions.", date: "01 Aug 2026" },
  { key: "expenses", label: "Expenses Report", icon: "bi-wallet2", desc: "Track your expense claims and status.", date: "03 Aug 2026" },
  { key: "helpCenter", label: "Help Center Report", icon: "bi-life-preserver", desc: "Your raised tickets and resolutions.", date: "29 Jul 2026" },
  { key: "tasks", label: "Tasks Report", icon: "bi-check2-square", desc: "Your assigned, completed & pending tasks.", date: "02 Aug 2026" },
];

const ReportsPage = () => {
  const [view, setView] = useState("hub"); // "hub" | "viewer"
  const [modalType, setModalType] = useState(null); // "attendance" | "payroll" | ...
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    
    // Set default filters
    if (type === "payroll") {
      setFilters({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      setFilters({ from: firstDay, to: today });
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      let data = [];
      if (modalType === "attendance") data = await reportService.getAttendanceReport(filters);
      if (modalType === "payroll") data = await reportService.getPayrollReport(filters);
      if (modalType === "expenses") data = await reportService.getExpensesReport(filters);
      if (modalType === "helpCenter") data = await reportService.getHelpCenterReport(filters);
      if (modalType === "tasks") data = await reportService.getTasksReport(filters);
      
      setReportData(data.rows || []);
      setView("viewer");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  if (view === "viewer") {
    // Actually wait, how do we know the selected type in viewer? 
    // We should keep modalType around, or store 'currentReportType'.
    // Ah, wait, modalType was set to null. Let's fix that below.
  }

  // --- Render ---

  // (This handles the state bug above: storing active report type)
  const [activeReport, setActiveReport] = useState(null);

  const handleLaunchFix = async () => {
    setLoading(true);
    try {
      let data = [];
      if (modalType === "attendance") data = await reportService.getAttendanceReport(filters);
      if (modalType === "payroll") data = await reportService.getPayrollReport(filters);
      if (modalType === "expenses") data = await reportService.getExpensesReport(filters);
      if (modalType === "helpCenter") data = await reportService.getHelpCenterReport(filters);
      if (modalType === "tasks") data = await reportService.getTasksReport(filters);
      
      setReportData(data.rows || []);
      setActiveReport(modalType);
      setView("viewer");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  if (view === "viewer") {
    return (
      <ReportViewer 
        type={activeReport} 
        filters={filters} 
        data={reportData} 
        onBack={() => setView("hub")} 
      />
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Generate and download reports for your account.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {REPORT_CARDS.map((card) => (
          <div key={card.key} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>{card.label}</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Last generated: {card.date}</p>
              </div>
            </div>
            
            <p style={{ fontSize: "14px", color: "#475569", marginBottom: "24px", flexGrow: 1 }}>{card.desc}</p>
            
            <button onClick={() => openModal(card.key)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #bfdbfe", background: "#fff", color: "#2563eb", fontWeight: "600", fontSize: "14px", cursor: "pointer" }} onMouseEnter={e => {e.target.style.background = "#eff6ff";}} onMouseLeave={e => {e.target.style.background = "#fff";}}>
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {modalType && (
        <ReportModal 
          type={modalType}
          isAdmin={false}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setModalType(null)}
          onLaunch={handleLaunchFix}
        />
      )}
      
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ padding: "16px 32px", background: "#1e3a8a", color: "#fff", borderRadius: "8px", fontWeight: "600" }}>Generating...</div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
