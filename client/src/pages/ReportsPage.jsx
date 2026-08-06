import React, { useState } from "react";
import ReportModal from "../components/admin/reports/ReportModal";
import ReportViewer from "../components/admin/reports/ReportViewer";

const REPORT_CARDS = [
  { key: "attendance", label: "Attendance Report", icon: "bi-calendar3", desc: "View your check-in, check-out, and working hours.", date: "05 Aug 2026" },
  { key: "payroll", label: "Payroll Report", icon: "bi-wallet2", desc: "View your monthly salary and deductions.", date: "01 Aug 2026" },
  { key: "expenses", label: "Expenses Report", icon: "bi-receipt", desc: "Track your expense claims and status.", date: "03 Aug 2026" },
  { key: "helpCenter", label: "Help Center Report", icon: "bi-headset", desc: "Your raised tickets and resolutions.", date: "29 Jul 2026" },
  { key: "tasks", label: "Tasks Report", icon: "bi-clipboard-check", desc: "Your assigned, completed & pending tasks.", date: "02 Aug 2026" },
];

const ReportsPage = () => {
  const [view, setView] = useState("hub"); 
  const [modalType, setModalType] = useState(null); 
  const [filters, setFilters] = useState({});
  const [activeReport, setActiveReport] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    
    // Set default filters
    if (type === "payroll") {
      setFilters({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), format: "pdf" });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      setFilters({ from: firstDay, to: today, format: "pdf" });
    }
  };

  const handleLaunch = () => {
    // ReportViewer fetches its own (sorted, paginated) data once mounted.
    setActiveReport(modalType);
    setView("viewer");
    setModalType(null);
  };

  if (view === "viewer") {
    return (
      <ReportViewer 
        type={activeReport} 
        filters={filters} 
        onBack={() => setView("hub")} 
      />
    );
  }

  return (
    <div style={{ padding: "32px", width: "100%", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Reports</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Generate and download reports for your account.</p>
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
          isAdmin={false}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setModalType(null)}
          onLaunch={handleLaunch}
          loading={false}
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

export default ReportsPage;
