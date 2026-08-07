import React, { useState, useEffect } from "react";
import adminEmployeeService from "../../../services/adminEmployeeService";

const EditEmployeeModal = ({ employee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    company: "",
    officialEmail: "",
    department: "",
    designation: "",
    role: "employee",
    reportingManager: "",
    officeLocation: "",
    salary: "",
    workMode: "Office",
    employmentStatus: "Active",
    employmentType: "Full-Time",
    joiningDate: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || "",
        employeeId: employee.employeeId || "",
        company: employee.companyName || "",
        officialEmail: employee.officialEmail || "",
        department: employee.department || "",
        designation: employee.designation || "",
        role: employee.role || "employee",
        reportingManager: employee.reportingManager || "",
        officeLocation: employee.officeLocation || "",
        salary: employee.salary || "",
        workMode: employee.workMode || "Office",
        employmentStatus: employee.employmentStatus || "Active",
        employmentType: employee.employmentType || "Full-Time",
        joiningDate: employee.joiningDate || "",
        phoneNumber: employee.phoneNumber || ""
      });
    }
  }, [employee]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminEmployeeService.updateEmployee(employee.id, formData);
      if (res.success) {
        onSuccess(res.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>Edit Employee: {employee.fullName}</h2>
          <button onClick={onClose} style={closeBtnStyle}><i className="bi bi-x-lg"></i></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          {error && <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}
          
          <h3 style={sectionHeaderStyle}>Personal Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Full Name *</label><input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Phone</label><input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Official Email</label><input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <h3 style={{ ...sectionHeaderStyle, marginTop: "24px" }}>Company Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Employee ID</label><input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} style={inputStyle} placeholder="e.g. EMP-1042" /></div>
            <div><label style={labelStyle}>Company Name</label><input type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <h3 style={{ ...sectionHeaderStyle, marginTop: "24px" }}>Work Details</h3>
          <div style={gridStyle}>
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
            <div><label style={labelStyle}>Reporting Manager</label><input type="text" name="reportingManager" value={formData.reportingManager} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Office Location</label><input type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Work Mode</label>
              <select name="workMode" value={formData.workMode} onChange={handleChange} style={inputStyle}>
                <option value="Office">Office</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div><label style={labelStyle}>Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange} style={inputStyle}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div><label style={labelStyle}>Joining Date</label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <h3 style={{ ...sectionHeaderStyle, marginTop: "24px" }}>System Details</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div><label style={labelStyle}>Status</label>
              <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div><label style={labelStyle}>Annual Salary</label><input type="number" name="salary" value={formData.salary} onChange={handleChange} style={inputStyle} /></div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Saving..." : "Save Changes"}
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

export default EditEmployeeModal;
