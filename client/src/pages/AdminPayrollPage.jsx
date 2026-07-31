import React, { useState, useEffect } from "react";
import axios from "axios";
import payrollService from "../services/payrollService";
import { onSocketEvent } from "../services/socketService";

const AdminPayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const initialForm = {
    employeeId: "", payPeriodMonth: "January", payPeriodYear: new Date().getFullYear(),
    basicSalary: 0, hra: 0, allowances: 0, bonus: 0, incentives: 0,
    tax: 0, pf: 0, esi: 0, professionalTax: 0, otherDeductions: 0,
    paymentDate: "", paymentMethod: "Bank Transfer", transactionReference: "", status: "Pending"
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchPayrolls = async () => {
    try {
      const res = await payrollService.getAllPayrolls();
      if (res.success) setPayrolls(res.payrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");
      const res = await axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.users.filter(u => u.role === "employee"));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
    
    const unsubscribeNew = onSocketEvent("payroll:new", (newPayroll) => {
      setPayrolls(prev => {
        if (!prev.find(p => p.id === newPayroll.id)) {
          return [newPayroll, ...prev];
        }
        return prev;
      });
    });

    const unsubscribeUpdated = onSocketEvent("payroll:updated", (updatedPayroll) => {
      setPayrolls(prev => prev.map(p => p.id === updatedPayroll.id ? updatedPayroll : p));
    });

    return () => {
      unsubscribeNew();
      unsubscribeUpdated();
    };
  }, []);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i);
  const departments = [...new Set(payrolls.map(p => p.department).filter(Boolean))];

  const filteredPayrolls = payrolls.filter(p => {
    const matchesSearch = p.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === "All" || p.payPeriodMonth === monthFilter;
    const matchesYear = yearFilter === "All" || p.payPeriodYear.toString() === yearFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesDept = departmentFilter === "All" || p.department === departmentFilter;
    return matchesSearch && matchesMonth && matchesYear && matchesStatus && matchesDept;
  });

  const uniqueEmployeesCount = new Set(payrolls.map(p => p.employeeId)).size;
  const processedPayrolls = payrolls.filter(p => p.status === "Processed" || p.status === "Paid").length;
  const pendingPayrolls = payrolls.filter(p => p.status === "Pending").length;
  const totalSalaryPaid = payrolls.filter(p => p.status === "Paid").reduce((acc, p) => acc + (p.netSalary || 0), 0);

  const getStatusBadge = (status) => {
    switch(status) {
      case "Paid": return "bg-success";
      case "Processed": return "bg-info text-dark";
      case "Pending": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["payPeriodMonth", "employeeId", "paymentMethod", "transactionReference", "status", "paymentDate"].includes(name) 
              ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (selectedPayroll && selectedPayroll.id) {
        res = await payrollService.updatePayroll(selectedPayroll.id, formData);
      } else {
        res = await payrollService.createPayroll(formData);
      }
      
      if (res.success) {
        setShowCreateModal(false);
        setFormData(initialForm);
        setSelectedPayroll(null);
        fetchPayrolls();
        setToastMessage(`Payroll ${selectedPayroll && selectedPayroll.id ? "updated" : "generated"} successfully.`);
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error submitting payroll:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Unable to save payroll. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedPayroll(null);
    setFormData(initialForm);
    setShowCreateModal(true);
  };

  const openEditModal = (payroll) => {
    setSelectedPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId,
      payPeriodMonth: payroll.payPeriodMonth,
      payPeriodYear: payroll.payPeriodYear,
      basicSalary: payroll.basicSalary,
      hra: payroll.hra,
      allowances: payroll.allowances,
      bonus: payroll.bonus,
      incentives: payroll.incentives,
      tax: payroll.tax,
      pf: payroll.pf,
      esi: payroll.esi,
      professionalTax: payroll.professionalTax,
      otherDeductions: payroll.otherDeductions,
      paymentDate: payroll.paymentDate ? new Date(payroll.paymentDate).toISOString().split("T")[0] : "",
      paymentMethod: payroll.paymentMethod || "Bank Transfer",
      transactionReference: payroll.transactionReference || "",
      status: payroll.status
    });
    setShowCreateModal(true);
  };

  const handleStatusChangeFast = async (id, status) => {
    try {
      const res = await payrollService.updatePayroll(id, { status });
      if (res.success) {
        setToastMessage(`Payroll status updated to ${status}.`);
        setTimeout(() => setToastMessage(""), 3000);
        fetchPayrolls();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = (e, payroll) => {
    e.stopPropagation();
    alert(`Downloading PDF for payslip ${payroll.id.substring(0,8).toUpperCase()}...`);
  };

  return (
    <div className="container-fluid p-4">
      {toastMessage && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow" role="alert">
            <div className="d-flex">
              <div className="toast-body"><i className="bi-check-circle-fill me-2"></i>{toastMessage}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")}></button>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Payroll Management</h4>
          <p className="text-muted mb-0 small">Manage employee payroll and salary records.</p>
        </div>
        <button className="btn btn-primary btn-sm px-3 shadow-sm rounded-2" onClick={openCreateModal}>
          <i className="bi-plus-lg me-2"></i>Generate Payroll
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Employees", value: uniqueEmployeesCount },
          { label: "Payroll Processed", value: processedPayrolls },
          { label: "Pending Payroll", value: pendingPayrolls },
          { label: "Total Salary Paid", value: `₹${totalSalaryPaid.toLocaleString()}` },
        ].map((stat, idx) => (
          <div className="col-12 col-sm-6 col-md-3" key={idx}>
            <div className="card border-0 shadow-sm rounded-2 h-100">
              <div className="card-body p-3">
                <div>
                  <div className="text-muted small fw-medium">{stat.label}</div>
                  <div className="fs-5 fw-bold text-dark">{stat.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap gap-3 align-items-center rounded-top-3">
          <div className="input-group input-group-sm" style={{ width: "220px" }}>
            <span className="input-group-text bg-white border-end-0"><i className="bi-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0 ps-0" placeholder="Search Employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-select form-select-sm w-auto text-muted" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
            <option value="All">Department: All</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto text-muted" value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
            <option value="All">Month: All</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto text-muted" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="All">Year: All</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto text-muted" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small uppercase tracking-wide">
                <tr>
                  <th className="ps-4 fw-medium border-0">Employee</th>
                  <th className="fw-medium border-0">Pay Period</th>
                  <th className="fw-medium border-0">Department</th>
                  <th className="fw-medium border-0">Gross Salary</th>
                  <th className="fw-medium border-0">Net Salary</th>
                  <th className="fw-medium border-0">Status</th>
                  <th className="pe-4 text-end fw-medium border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.length > 0 ? (
                  filteredPayrolls.map(p => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark small">{p.employeeName}</div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>ID: {p.employeeId.substring(0,8).toUpperCase()}</div>
                      </td>
                      <td className="small text-muted">{p.payPeriodMonth} {p.payPeriodYear}</td>
                      <td className="small text-muted">{p.department}</td>
                      <td className="small text-dark fw-medium">₹{p.grossSalary.toLocaleString()}</td>
                      <td className="small text-success fw-bold">₹{p.netSalary.toLocaleString()}</td>
                      <td>
                        <div className="dropdown">
                          <button className={`btn btn-sm dropdown-toggle rounded-pill py-0 px-2 small border-0 fw-medium ${getStatusBadge(p.status)}`} type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: "0.75rem" }}>
                            {p.status}
                          </button>
                          <ul className="dropdown-menu dropdown-menu-sm shadow-sm py-1" style={{ fontSize: "0.8rem" }}>
                            <li><button className="dropdown-item py-1" onClick={() => handleStatusChangeFast(p.id, "Pending")}>Pending</button></li>
                            <li><button className="dropdown-item py-1" onClick={() => handleStatusChangeFast(p.id, "Processed")}>Processed</button></li>
                            <li><button className="dropdown-item py-1" onClick={() => handleStatusChangeFast(p.id, "Paid")}>Paid</button></li>
                          </ul>
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-sm btn-light text-primary border me-1" onClick={() => openEditModal(p)} title="Edit">
                          <i className="bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-dark border me-1" onClick={() => { setSelectedPayroll(p); setShowDetailsModal(true); }} title="View Details">
                          <i className="bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-muted border" onClick={(e) => handleDownload(e, p)} title="Download Payslip">
                          <i className="bi-file-pdf"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <h6 className="fw-medium text-dark mb-1">No payroll records available.</h6>
                      <p className="small text-muted mb-0">Create payroll to generate employee salary records.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold">{selectedPayroll ? "Edit Payroll" : "Generate Payroll"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <form id="payrollForm" onSubmit={handleSubmit}>
                  <div className="card border-0 shadow-sm mb-4 rounded-3">
                    <div className="card-body p-4">
                      <h6 className="fw-bold text-muted small text-uppercase mb-3">General Information</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-medium">Employee <span className="text-danger">*</span></label>
                          <select className="form-select form-select-sm" name="employeeId" required value={formData.employeeId} onChange={handleInputChange} disabled={!!selectedPayroll}>
                            <option value="">Select Employee</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>)}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label small fw-medium">Pay Month</label>
                          <select className="form-select form-select-sm" name="payPeriodMonth" value={formData.payPeriodMonth} onChange={handleInputChange}>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label small fw-medium">Pay Year</label>
                          <select className="form-select form-select-sm" name="payPeriodYear" value={formData.payPeriodYear} onChange={handleInputChange}>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 h-100">
                        <div className="card-body p-4">
                          <h6 className="fw-bold text-success small text-uppercase mb-3">Earnings</h6>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Basic Salary <span className="text-danger">*</span></label>
                            <input type="number" className="form-control form-control-sm" name="basicSalary" required min="0" value={formData.basicSalary} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">HRA</label>
                            <input type="number" className="form-control form-control-sm" name="hra" min="0" value={formData.hra} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Allowances</label>
                            <input type="number" className="form-control form-control-sm" name="allowances" min="0" value={formData.allowances} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Bonus</label>
                            <input type="number" className="form-control form-control-sm" name="bonus" min="0" value={formData.bonus} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Incentives</label>
                            <input type="number" className="form-control form-control-sm" name="incentives" min="0" value={formData.incentives} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 h-100">
                        <div className="card-body p-4">
                          <h6 className="fw-bold text-danger small text-uppercase mb-3">Deductions</h6>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Tax (TDS)</label>
                            <input type="number" className="form-control form-control-sm" name="tax" min="0" value={formData.tax} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">PF</label>
                            <input type="number" className="form-control form-control-sm" name="pf" min="0" value={formData.pf} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">ESI</label>
                            <input type="number" className="form-control form-control-sm" name="esi" min="0" value={formData.esi} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Professional Tax</label>
                            <input type="number" className="form-control form-control-sm" name="professionalTax" min="0" value={formData.professionalTax} onChange={handleInputChange} />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-muted mb-1">Other Deductions</label>
                            <input type="number" className="form-control form-control-sm" name="otherDeductions" min="0" value={formData.otherDeductions} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm rounded-3 mb-2">
                    <div className="card-body p-4">
                      <h6 className="fw-bold text-muted small text-uppercase mb-3">Payment Details</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small text-muted mb-1">Status</label>
                          <select className="form-select form-select-sm" name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="Pending">Pending</option>
                            <option value="Processed">Processed</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small text-muted mb-1">Payment Date</label>
                          <input type="date" className="form-control form-control-sm" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small text-muted mb-1">Payment Method</label>
                          <select className="form-select form-select-sm" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label small text-muted mb-1">Transaction Reference</label>
                          <input type="text" className="form-control form-control-sm" name="transactionReference" placeholder="e.g. UTR Number" value={formData.transactionReference} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
              <div className="modal-footer border-top bg-white">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div className="text-muted small">
                    Net Salary Preview: <strong className="text-dark fs-6 ms-1">
                      ₹{ (
                        (formData.basicSalary + formData.hra + formData.allowances + formData.bonus + formData.incentives) -
                        (formData.tax + formData.pf + formData.esi + formData.professionalTax + formData.otherDeductions)
                      ).toLocaleString() }
                    </strong>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border fw-medium" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" form="payrollForm" className="btn btn-primary btn-sm px-4 rounded-2 fw-medium" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Payroll"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedPayroll && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Payslip - {selectedPayroll.payPeriodMonth} {selectedPayroll.payPeriodYear}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Employee Information</h6>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "120px"}}>Name:</span> <span className="fw-medium">{selectedPayroll.employeeName}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "120px"}}>Employee ID:</span> <span className="fw-medium">{selectedPayroll.employeeId.substring(0,8).toUpperCase()}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "120px"}}>Department:</span> <span className="fw-medium">{selectedPayroll.department}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "120px"}}>Designation:</span> <span className="fw-medium">{selectedPayroll.designation}</span></div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Payment Information</h6>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "130px"}}>Payslip ID:</span> <span className="fw-medium">{selectedPayroll.id.substring(0,8).toUpperCase()}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "130px"}}>Payment Date:</span> <span className="fw-medium">{selectedPayroll.paymentDate ? new Date(selectedPayroll.paymentDate).toLocaleDateString() : "-"}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "130px"}}>Payment Method:</span> <span className="fw-medium">{selectedPayroll.paymentMethod || "-"}</span></div>
                    <div className="small mb-1"><span className="text-muted d-inline-block" style={{width: "130px"}}>Transaction Ref:</span> <span className="fw-medium">{selectedPayroll.transactionReference || "-"}</span></div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Earnings</h6>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Basic Salary</span> <span className="fw-medium">₹{selectedPayroll.basicSalary.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">HRA</span> <span className="fw-medium">₹{selectedPayroll.hra.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Allowances</span> <span className="fw-medium">₹{selectedPayroll.allowances.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Bonus</span> <span className="fw-medium">₹{selectedPayroll.bonus.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Incentives</span> <span className="fw-medium">₹{selectedPayroll.incentives.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between mt-3"><span className="fw-bold">Gross Salary</span> <span className="fw-bold text-dark">₹{selectedPayroll.grossSalary.toLocaleString()}</span></div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Deductions</h6>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Tax (TDS)</span> <span className="fw-medium">₹{selectedPayroll.tax.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">PF</span> <span className="fw-medium">₹{selectedPayroll.pf.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">ESI</span> <span className="fw-medium">₹{selectedPayroll.esi.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Professional Tax</span> <span className="fw-medium">₹{selectedPayroll.professionalTax.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between small mb-2 pb-1 border-bottom"><span className="text-muted">Other Deductions</span> <span className="fw-medium">₹{selectedPayroll.otherDeductions.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between mt-3"><span className="fw-bold text-danger">Total Deductions</span> <span className="fw-bold text-danger">₹{((selectedPayroll.grossSalary || 0) - (selectedPayroll.netSalary || 0)).toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-0">Net Salary</h6>
                    <small className="text-muted">({selectedPayroll.payPeriodMonth} {selectedPayroll.payPeriodYear})</small>
                  </div>
                  <h3 className="fw-bold text-success mb-0">₹{selectedPayroll.netSalary.toLocaleString()}</h3>
                </div>

              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border" onClick={() => setShowDetailsModal(false)}>Close</button>
                <button type="button" className="btn btn-primary btn-sm px-4 rounded-2 fw-medium" onClick={(e) => handleDownload(e, selectedPayroll)}><i className="bi-download me-2"></i>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayrollPage;
