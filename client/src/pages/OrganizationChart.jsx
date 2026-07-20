import React from 'react';

const OrganizationChart = () => {
  return (
    <div className="orgchart-container" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--crm-dark)", fontSize: "22px" }}>Organization Chart</h3>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>View your company's organizational structure.</p>
        </div>
        
        {/* STATS CARD */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: "10px", minWidth: "200px" }}>
          <div className="card-body p-3 d-flex align-items-center">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-people text-primary"></i>
            </div>
            <div>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Total Employees</p>
              <h5 className="fw-bold mb-0">0</h5>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="card shadow-sm" style={{ border: "1px solid #e2e8f0", borderRadius: "10px", minHeight: "500px", backgroundColor: "#fff" }}>
        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center h-100" style={{ minHeight: "500px" }}>
          <i className="bi bi-diagram-3 text-muted mb-3" style={{ fontSize: "48px" }}></i>
          <h4 className="fw-bold mb-2">Organization Chart Not Available</h4>
          <p className="text-muted" style={{ maxWidth: "400px" }}>
            The organizational hierarchy will appear here once it has been configured.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationChart;
