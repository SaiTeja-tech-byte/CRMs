import React, { useState, useEffect } from "react";
import adminEmployeeService from "../services/adminEmployeeService";

export default function AdminEmployeeProfilePage({ id, onBack }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await adminEmployeeService.getEmployeeProfile(id);
        if (res.success) setEmployee(res.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading profile...</div>;
  if (!employee) return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>Employee not found.</div>;

  const tabs = ["Overview", "Attendance", "Payroll", "Expenses", "Leave", "Help Tickets", "Documents", "Activity", "Settings"];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="bi bi-arrow-left"></i> Back to Employees
        </button>
      </div>
      
      <div style={{ display: "flex", gap: "24px", alignItems: "center", background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", color: "#64748b" }}>
          {employee.fullName?.charAt(0) || "U"}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: "24px", color: "#0f172a", fontWeight: "700" }}>{employee.fullName}</h1>
          <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "14px" }}>
            <span><i className="bi bi-briefcase" style={{ marginRight: "6px" }}></i>{employee.designation || "No Designation"}</span>
            <span><i className="bi bi-building" style={{ marginRight: "6px" }}></i>{employee.department || "No Department"}</span>
            <span><i className="bi bi-geo-alt" style={{ marginRight: "6px" }}></i>{employee.officeLocation || "No Location"}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: employee.employmentStatus === "Active" ? "#dcfce7" : "#fee2e2", color: employee.employmentStatus === "Active" ? "#16a34a" : "#b91c1c", marginBottom: "8px" }}>
            {employee.employmentStatus || "Active"}
          </span>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
            ID: <span style={{ color: "#0f172a" }}>{employee.employeeId || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid #e2e8f0", marginBottom: "24px", overflowX: "auto" }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: "none", 
              border: "none", 
              padding: "0 0 12px 0", 
              fontSize: "14px", 
              fontWeight: activeTab === tab ? "600" : "500", 
              color: activeTab === tab ? "#2563eb" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", minHeight: "400px" }}>
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Personal Information</h3>
              <table style={{ width: "100%", fontSize: "14px", color: "#475569" }}>
                <tbody>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Email</td><td style={{ color: "#0f172a" }}>{employee.email}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Phone</td><td style={{ color: "#0f172a" }}>{employee.phoneNumber || "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Join Date</td><td style={{ color: "#0f172a" }}>{employee.joiningDate || "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Type</td><td style={{ color: "#0f172a" }}>{employee.employmentType || "Full-Time"}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Work Information</h3>
              <table style={{ width: "100%", fontSize: "14px", color: "#475569" }}>
                <tbody>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Department</td><td style={{ color: "#0f172a" }}>{employee.department || "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Manager</td><td style={{ color: "#0f172a" }}>{employee.reportingManager || "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Work Mode</td><td style={{ color: "#0f172a" }}>{employee.workMode || "Office"}</td></tr>
                  <tr><td style={{ padding: "8px 0", fontWeight: "500" }}>Salary</td><td style={{ color: "#0f172a" }}>{employee.salary ? `$${employee.salary.toLocaleString()}` : "N/A"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== "Overview" && (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
            <i className="bi bi-tools" style={{ fontSize: "48px", marginBottom: "16px", display: "block", color: "#cbd5e1" }}></i>
            <h3 style={{ margin: "0 0 8px", color: "#475569" }}>{activeTab} Module</h3>
            <p>This module view will display specific {activeTab.toLowerCase()} records for {employee.fullName}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
