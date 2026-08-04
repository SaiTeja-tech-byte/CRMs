import React, { useState } from "react";
import adminEmployeeService from "../../../services/adminEmployeeService";

const AddEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeId: "",
    department: "",
    designation: "",
    role: "employee",
    manager: "",
    officeLocation: "",
    salary: "",
    workMode: "Office"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null); // stores tempPassword

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminEmployeeService.createEmployee(formData);
      if (res.success) {
        setSuccessData(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <div style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <i className="bi bi-check-lg" style={{ fontSize: "32px", color: "#16a34a" }}></i>
            </div>
            <h2 style={{ margin: "0 0 16px", fontSize: "24px", color: "#0f172a" }}>Employee Added!</h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              {successData.user.fullName} has been successfully added to the organization.
            </p>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#475569" }}>Temporary Login Password:</p>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" }}>
                {successData.tempPassword}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#ef4444" }}>
                Please copy this now! It will not be shown again.
              </p>
            </div>
            <button onClick={() => { onClose(); onSuccess(); }} style={primaryBtnStyle}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>Add New Employee</h2>
          <button onClick={onClose} style={closeBtnStyle}><i className="bi bi-x-lg"></i></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          {error && <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}
          
          <h3 style={sectionHeaderStyle}>Personal Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>First Name *</label><input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Last Name *</label><input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Email *</label><input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <h3 style={{ ...sectionHeaderStyle, marginTop: "24px" }}>Work Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Employee ID</label><input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
                <option value="">Select Department...</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div><label style={labelStyle}>Designation</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Reporting Manager</label><input type="text" name="manager" value={formData.manager} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Office Location</label><input type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Work Mode</label>
              <select name="workMode" value={formData.workMode} onChange={handleChange} style={inputStyle}>
                <option value="Office">Office</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <h3 style={{ ...sectionHeaderStyle, marginTop: "24px" }}>System Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div><label style={labelStyle}>Annual Salary</label><input type="number" name="salary" placeholder="e.g. 80000" value={formData.salary} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" };
const modalContentStyle = { background: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "700px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", overflow: "hidden" };
const closeBtnStyle = { background: "none", border: "none", fontSize: "20px", color: "#64748b", cursor: "pointer", padding: "4px" };
const sectionHeaderStyle = { margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" };
const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none", transition: "all 0.2s", boxSizing: "border-box" };
const secondaryBtnStyle = { padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
const primaryBtnStyle = { padding: "10px 24px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" };

export default AddEmployeeModal;
