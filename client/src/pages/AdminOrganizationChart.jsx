import React from 'react';

const AdminOrganizationChart = () => {
  return (
    <div className="admin-orgchart-container" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
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

      <div className="d-flex gap-3" style={{ alignItems: "stretch", minHeight: "500px" }}>
        {/* LEFT FILTER PANEL */}
        <div className="card shadow-sm" style={{ width: "260px", minWidth: "260px", border: "1px solid #e2e8f0", borderRadius: "10px", backgroundColor: "#fff" }}>
          <div className="card-body p-3">
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Search by Name</label>
              <input type="text" className="form-control" placeholder="Type a name..." style={{ fontSize: "13px", height: "34px" }} />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Location</label>
              <select className="form-select" style={{ fontSize: "13px", height: "34px", padding: "4px 32px 4px 12px" }}>
                <option value="All">All</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Department</label>
              <select className="form-select" style={{ fontSize: "13px", height: "34px", padding: "4px 32px 4px 12px" }}>
                <option value="All">All</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Job Role</label>
              <select className="form-select" style={{ fontSize: "13px", height: "34px", padding: "4px 32px 4px 12px" }}>
                <option value="All">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card shadow-sm flex-grow-1" style={{ border: "1px solid #e2e8f0", borderRadius: "10px", backgroundColor: "#fff" }}>
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center h-100" style={{ minHeight: "500px" }}>
            <i className="bi bi-diagram-3 text-muted mb-3" style={{ fontSize: "48px" }}></i>
            <h4 className="fw-bold mb-2">Organization Chart Not Available</h4>
            <p className="text-muted" style={{ maxWidth: "400px" }}>
              The organizational hierarchy will appear here once it has been configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrganizationChart;
