import React, { useState } from "react";
import reportService from "../services/reportService";
import ReportModal from "../components/admin/reports/ReportModal";
import ReportViewer from "../components/admin/reports/ReportViewer";

const REPORT_CARDS = [
  { key: "organization", label: "Organization Report", icon: "bi-building", desc: "View a high-level summary of headcount and departments.", date: "05 Aug 2026" },
  { key: "employees", label: "Employee Report", icon: "bi-people", desc: "Export a full list of all employees and their statuses.", date: "05 Aug 2026" },
  { key: "attendance", label: "Attendance Report", icon: "bi-calendar3", desc: "View organization-wide attendance records.", date: "04 Aug 2026" },
  { key: "payroll", label: "Payroll Report", icon: "bi-wallet2", desc: "View salary and payment records for all employees.", date: "01 Aug 2026" },
  { key: "expenses", label: "Expenses Report", icon: "bi-receipt", desc: "Track expense claims across departments.", date: "01 Aug 2026" },
  { key: "helpCenter", label: "Help Center Report", icon: "bi-headset", desc: "Monitor ticket statuses and resolution times.", date: "29 Jul 2026" },
  { key: "tasks", label: "Tasks Report", icon: "bi-clipboard-check", desc: "Track tasks progress and completion rates.", date: "02 Aug 2026" },
];

const STATS = [
  { label: "Reports Generated", value: "342" },
  { label: "This Month", value: "28" },
  { label: "Most Downloaded", value: "Attendance" },
  { label: "Last Generated", value: "Today, 10:42 AM" },
];

const AdminReportsPage = () => {
  const [view, setView] = useState("hub"); // "hub" | "viewer"
  const [modalType, setModalType] = useState(null); // "attendance" | "payroll" | ...
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    
    // Set default filters
    if (type === "payroll") {
      setFilters({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), name: "", department: "", format: "pdf" });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      setFilters({ from: firstDay, to: today, name: "", department: "", format: "pdf" });
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
      if (modalType === "employees") data = await reportService.getEmployeesReport(filters);
      if (modalType === "organization") data = await reportService.getOrganizationReport(filters);
      
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
    <div style={{ padding: "32px", width: "100%", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Generate organization reports.</p>
      </div>

      {/* Admin Statistics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{ background: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", fontWeight: "600", textTransform: "uppercase" }}>{stat.label}</p>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="reports-grid">
        {REPORT_CARDS.map((card) => (
          <div 
            key={card.key} 
            className="report-card"
          >
            {/* Top Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px 0" }}>{card.label}</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Last generated: {card.date}</p>
              </div>
            </div>
            
            {/* Middle */}
            <div style={{ flexGrow: 1, marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {card.desc}
              </p>
            </div>
            
            {/* Bottom */}
            <button 
              onClick={() => openModal(card.key)} 
              className="generate-btn"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {modalType && (
        <ReportModal 
          type={modalType}
          isAdmin={true}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setModalType(null)}
          onLaunch={handleLaunch}
          loading={loading}
        />
      )}
      
      <style>{`
        .reports-grid {
          display: grid;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .reports-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .reports-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 767px) {
          .reports-grid { grid-template-columns: repeat(1, 1fr); }
        }

        .report-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        .report-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }

        .generate-btn {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #2563eb;
          background: #fff;
          color: #2563eb;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .generate-btn:hover {
          background: #eff6ff;
        }
      `}</style>
    </div>
  );
};

export default AdminReportsPage;
