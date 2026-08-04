import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminEmployeeService from "../services/adminEmployeeService";
import AddEmployeeModal from "../components/admin/employees/AddEmployeeModal";
import EditEmployeeModal from "../components/admin/employees/EditEmployeeModal";

export default function AdminEmployeesPage({ onViewEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  
  // Filters & Search
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  
  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;
      if (department) params.department = department;
      if (role) params.role = role;
      if (status) params.employmentStatus = status;

      const res = await adminEmployeeService.getEmployees(params);
      if (res.success) {
        setEmployees(res.users);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [pagination.page, department, role, status]);

  // Handle Search input enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setPagination({ ...pagination, page: 1 });
      fetchEmployees();
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(employees.map(emp => emp.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to perform this action on ${selectedIds.length} employees?`)) return;
    
    try {
      let updateData = {};
      if (action === "suspend") updateData = { employmentStatus: "Suspended" };
      if (action === "activate") updateData = { employmentStatus: "Active" };
      if (action === "delete") {
        alert("Bulk delete is disabled for safety. Please use suspend.");
        return;
      }
      
      const res = await adminEmployeeService.bulkUpdateEmployees({ userIds: selectedIds, updateData });
      if (res.success) {
        setSelectedIds([]);
        fetchEmployees();
      }
    } catch (err) {
      alert("Failed to perform bulk action");
    }
  };

  const exportToCSV = () => {
    if (employees.length === 0) return;
    const headers = ["Employee ID", "Name", "Email", "Department", "Designation", "Role", "Status", "Work Mode"];
    const csvRows = [headers.join(",")];
    
    employees.forEach(emp => {
      const row = [
        `"${emp.employeeId || ""}"`,
        `"${emp.fullName || ""}"`,
        `"${emp.email || ""}"`,
        `"${emp.department || ""}"`,
        `"${emp.designation || ""}"`,
        `"${emp.role || ""}"`,
        `"${emp.employmentStatus || ""}"`,
        `"${emp.workMode || ""}"`
      ];
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `employees_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>Employees</h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Manage your workforce, view profiles, and update roles.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={exportToCSV} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="bi bi-file-earmark-excel"></i> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="bi bi-plus-lg"></i> Add Employee
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <i className="bi bi-search" style={{ position: "absolute", left: "12px", top: "10px", color: "#94a3b8" }}></i>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
          />
        </div>
        
        <select value={department} onChange={e => setDepartment(e.target.value)} style={selectStyle}>
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        
        <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
          <option value="">All Roles</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        
        <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div style={{ background: "#eff6ff", padding: "12px 24px", borderRadius: "12px", border: "1px solid #bfdbfe", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e3a8a" }}>{selectedIds.length} employees selected</span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => handleBulkAction("activate")} style={bulkBtnStyle}>Mark Active</button>
            <button onClick={() => handleBulkAction("suspend")} style={{...bulkBtnStyle, color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2"}}>Suspend</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading employees...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={{ padding: "16px 24px" }}><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === employees.length && employees.length > 0} /></th>
                  <th style={thStyle}>Employee</th>
                  <th style={thStyle}>ID / Department</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: "600", color: "#64748b", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No employees found.</td></tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 24px" }}><input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => handleSelectOne(emp.id)} /></td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", color: "#64748b" }}>
                            {emp.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: "600", color: "#0f172a" }}>{emp.fullName}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontWeight: "500", color: "#334155" }}>{emp.employeeId || "N/A"}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{emp.department || "No Dept"}</div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", background: emp.role === "admin" ? "#fef08a" : "#f1f5f9", color: emp.role === "admin" ? "#854d0e" : "#475569" }}>
                          {emp.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", background: emp.employmentStatus === "Active" ? "#dcfce7" : "#fee2e2", color: emp.employmentStatus === "Active" ? "#16a34a" : "#b91c1c" }}>
                          {emp.employmentStatus || "Active"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button onClick={() => onViewEmployee(emp.id)} style={{ marginRight: "16px", color: "#2563eb", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>View</button>
                        <button onClick={() => setEditEmployee(emp)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Page {pagination.page} of {pagination.totalPages}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              disabled={pagination.page === 1} 
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              style={{ ...pageBtnStyle, opacity: pagination.page === 1 ? 0.5 : 1 }}>Previous</button>
            <button 
              disabled={pagination.page === pagination.totalPages} 
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              style={{ ...pageBtnStyle, opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEmployeeModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { setShowAddModal(false); fetchEmployees(); }} 
        />
      )}
      {editEmployee && (
        <EditEmployeeModal 
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSuccess={() => { setEditEmployee(null); fetchEmployees(); }}
        />
      )}
    </div>
  );
}

// Styles
const thStyle = { padding: "16px 24px", fontWeight: "600", color: "#64748b" };
const selectStyle = { padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none", cursor: "pointer", background: "#fff", minWidth: "150px" };
const bulkBtnStyle = { padding: "6px 16px", borderRadius: "6px", border: "1px solid #bfdbfe", background: "#fff", color: "#1e3a8a", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
const pageBtnStyle = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "13px", cursor: "pointer" };
