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

      <div className="reports-grid">
        {REPORT_CARDS.map((card) => (
          <div 
            key={card.key} 
            className="report-card"
          >
            {/* Content */}
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: "0 0 8px 0" }}>{card.label}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {card.desc}
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Last generated: {card.date}</p>
            </div>
            
            {/* Button */}
            <div style={{ marginTop: "auto" }}>
              <button 
                onClick={() => openModal(card.key)} 
                className="generate-btn"
              >
                Generate Report
              </button>
            </div>
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
          border: 1px solid #E5E7EB;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          transition: box-shadow 0.2s ease;
          height: 100%;
        }
        .report-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .generate-btn {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          background: #FFFFFF;
          color: #374151;
          border: 1px solid #D1D5DB;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .generate-btn:hover {
          background: #F9FAFB;
          border-color: #2563EB;
          color: #2563EB;
        }
      `}</style>
    </div>
  );
};

export default AdminReportsPage;
