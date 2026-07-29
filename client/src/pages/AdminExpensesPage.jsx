import React, { useState, useEffect } from "react";
import expenseService from "../services/expenseService";
import { onSocketEvent } from "../services/socketService";

const AdminExpensesPage = () => {
  // Empty state by default
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    fetchExpenses();
    const unsubNew = onSocketEvent("expense:new", handleSocketEvent);
    const unsubUpdate = onSocketEvent("expense:updated", handleSocketEvent);
    return () => {
      unsubNew();
      unsubUpdate();
    };
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await expenseService.getAllExpenses();
      if (res.success) setExpenses(res.expenses);
    } catch (error) {
      console.error("Error fetching admin expenses:", error);
    }
  };

  const handleSocketEvent = () => fetchExpenses();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateRange, setDateRange] = useState("");

  const openDetails = (expense) => {
    setSelectedExpense(expense);
    setShowDetailsModal(true);
  };

  const handleApprove = async () => {
    try {
      await expenseService.updateExpenseStatus(selectedExpense.id, "Approved");
      fetchExpenses();
      setSelectedExpense({ ...selectedExpense, status: "Approved" });
      setShowApproveConfirm(false);
      setToastMessage("Expense request approved successfully.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Error approving expense:", error);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    try {
      await expenseService.updateExpenseStatus(selectedExpense.id, "Rejected", rejectReason);
      fetchExpenses();
      setSelectedExpense({ ...selectedExpense, status: "Rejected", rejectReason });
      setShowRejectConfirm(false);
      setRejectReason("");
      setToastMessage("Expense request rejected.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Error rejecting expense:", error);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "Pending": return "bg-warning text-dark";
      case "Approved": return "bg-success";
      case "Rejected": return "bg-danger";
      case "Reimbursed": return "bg-info text-dark";
      case "Withdrawn": return "bg-secondary";
      default: return "bg-secondary";
    }
  };

  const totalClaims = expenses.length;
  const pending = expenses.filter(e => e.status === "Pending").length;
  const approved = expenses.filter(e => e.status === "Approved").length;
  const rejected = expenses.filter(e => e.status === "Rejected").length;
  const reimbursedAmt = expenses.filter(e => e.status === "Reimbursed").reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || exp.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
    const matchesDept = departmentFilter === "All" || exp.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesDept;
  });

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Expenses</h4>
          <p className="text-muted small mb-0">Review and manage employee expense reimbursement requests.</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm px-4 rounded-2 fw-medium border">
          <i className="bi-download me-2"></i>Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Claims", value: totalClaims },
          { label: "Pending Review", value: pending },
          { label: "Approved", value: approved },
          { label: "Rejected", value: rejected },
          { label: "Total Reimbursed", value: `₹${reimbursedAmt.toFixed(2)}` },
        ].map((stat, idx) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg" key={idx}>
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

      {/* Main Content */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          
          {/* Filters */}
          <div className="p-3 border-bottom bg-white d-flex flex-wrap gap-2 align-items-center justify-content-between rounded-top-3">
            <div className="d-flex flex-wrap gap-2 flex-grow-1">
              <div className="input-group input-group-sm" style={{ width: '250px' }}>
                <span className="input-group-text bg-white border-end-0"><i className="bi-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Search employee or expense..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select className="form-select form-select-sm w-auto text-muted" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
              <select className="form-select form-select-sm w-auto text-muted" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="All">Category: All</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Internet">Internet</option>
              </select>
              <select className="form-select form-select-sm w-auto text-muted" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                <option value="All">Department: All</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
              <input type="date" className="form-control form-control-sm w-auto text-muted" value={dateRange} onChange={e => setDateRange(e.target.value)} />
            </div>
            <div>
              <select className="form-select form-select-sm w-auto text-muted">
                <option>Sort: Latest</option>
                <option>Sort: Oldest</option>
                <option>Sort: Highest Amount</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="small fw-semibold text-muted text-uppercase ps-4 border-0">Employee</th>
                  <th className="small fw-semibold text-muted text-uppercase border-0">Expense Title</th>
                  <th className="small fw-semibold text-muted text-uppercase border-0">Category</th>
                  <th className="small fw-semibold text-muted text-uppercase border-0">Amount</th>
                  <th className="small fw-semibold text-muted text-uppercase border-0">Submitted Date</th>
                  <th className="small fw-semibold text-muted text-uppercase border-0">Status</th>
                  <th className="small fw-semibold text-muted text-uppercase pe-4 text-end border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="ps-4">
                        <div className="fw-medium text-dark">{exp.employeeName}</div>
                        <div className="small text-muted">{exp.department}</div>
                      </td>
                      <td className="fw-medium text-dark">{exp.title}</td>
                      <td><span className="text-muted small">{exp.category}</span></td>
                      <td className="fw-bold text-dark">₹{parseFloat(exp.amount).toFixed(2)}</td>
                      <td><span className="text-muted small">{exp.submittedDate}</span></td>
                      <td><span className={`badge rounded-pill fw-medium ${getBadgeClass(exp.status)}`}>{exp.status}</span></td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-sm btn-link text-primary text-decoration-none fw-medium p-0" onClick={() => openDetails(exp)}>View Details</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="py-4">
                        <h6 className="fw-bold text-dark mb-1">No expense requests found.</h6>
                        <p className="text-muted small mb-0">No employee expense reimbursement requests have been submitted yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedExpense && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center">
                <div className="d-flex align-items-center flex-wrap gap-3 w-100 me-2">
                  <h5 className="modal-title fw-bold text-dark mb-0">{selectedExpense.title}</h5>
                  <span className="text-muted small">ID: {selectedExpense.id}</span>
                  <span className="text-muted small">{selectedExpense.date}</span>
                  <span className={`badge rounded-pill fw-medium ${getBadgeClass(selectedExpense.status)}`}>{selectedExpense.status}</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body p-4 bg-white">
                <div className="row mb-4">
                  <div className="col-md-7 mb-4 mb-md-0">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>Employee Information</h6>
                    <div className="d-flex flex-column gap-3 mb-4">
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Employee Name</div>
                        <div className="fw-medium text-dark small">{selectedExpense.employeeName}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Employee ID</div>
                        <div className="fw-medium text-dark small">{selectedExpense.employeeId}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Department</div>
                        <div className="fw-medium text-dark small">{selectedExpense.department}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Designation</div>
                        <div className="fw-medium text-dark small">{selectedExpense.designation}</div>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>Expense Information</h6>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Expense ID</div>
                        <div className="fw-medium text-dark small">{selectedExpense.id}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Expense Title</div>
                        <div className="fw-medium text-dark small">{selectedExpense.title}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Category</div>
                        <div className="fw-medium text-dark small">{selectedExpense.category}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Amount</div>
                        <div className="fw-medium text-dark small">₹{parseFloat(selectedExpense.amount || 0).toFixed(2)}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Expense Date</div>
                        <div className="fw-medium text-dark small">{selectedExpense.date}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Payment Method</div>
                        <div className="fw-medium text-dark small">{selectedExpense.paymentMethod}</div>
                      </div>
                      <div className="d-flex">
                        <div className="text-muted small" style={{ width: '140px' }}>Description</div>
                        <div className="fw-medium text-dark small">{selectedExpense.description || 'No description provided.'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>Status</h6>
                    <div className="position-relative ms-2 ps-3 pb-2" style={{ borderLeft: '1px solid #dee2e6' }}>
                      <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d6efd', top: '0' }}></div>
                      <div className="mb-3">
                        <p className="mb-0 fw-medium text-dark small">Submitted</p>
                      </div>

                      <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedExpense.status !== 'Pending' ? '#198754' : '#ffc107', top: '45px' }}></div>
                      <div className="mb-3">
                        <p className="mb-0 fw-medium text-dark small">Pending Review</p>
                      </div>

                      {(selectedExpense.status === 'Approved' || selectedExpense.status === 'Reimbursed') && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedExpense.status === 'Reimbursed' ? '#198754' : '#ffc107', top: '90px' }}></div>
                          <div className="mb-3">
                            <p className="mb-0 fw-medium text-dark small">Approved</p>
                          </div>
                        </>
                      )}

                      {selectedExpense.status === 'Rejected' && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc3545', top: '90px' }}></div>
                          <div className="mb-3">
                            <p className="mb-0 fw-medium text-danger small">Rejected</p>
                          </div>
                        </>
                      )}
                      
                      {selectedExpense.status === 'Reimbursed' && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#198754', top: '135px' }}></div>
                          <div>
                            <p className="mb-0 fw-medium text-success small">Reimbursed</p>
                          </div>
                        </>
                      )}

                      {selectedExpense.status === 'Withdrawn' && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6c757d', top: '90px' }}></div>
                          <div>
                            <p className="mb-0 fw-medium text-secondary small">Withdrawn</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>Uploaded Receipts</h6>
                  {selectedExpense.receipts && selectedExpense.receipts.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {selectedExpense.receipts.map((file, idx) => (
                        <div key={idx} className="d-flex align-items-center small p-2 rounded-2 border">
                          <i className="bi-file-earmark-pdf text-muted me-2"></i>
                          <span className="fw-medium text-dark me-auto">{file.name}</span>
                          <button className="btn btn-link text-primary p-0 text-decoration-none small me-3 border-0">Preview</button>
                          <button className="btn btn-link text-primary p-0 text-decoration-none small border-0">Download</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No receipts uploaded.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer border-top p-3 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border fw-medium text-dark" onClick={() => setShowDetailsModal(false)}>Close</button>
                {selectedExpense.status === "Pending" && (
                  <>
                    <button type="button" className="btn btn-outline-danger btn-sm px-4 rounded-2 fw-medium" onClick={() => setShowRejectConfirm(true)}>Reject</button>
                    <button type="button" className="btn btn-success btn-sm px-4 rounded-2 fw-medium" onClick={() => setShowApproveConfirm(true)}>Approve</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      {showApproveConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-body p-4 text-center">
                <div className="text-success mb-3">
                  <i className="bi-check-circle" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Approve Expense</h5>
                <p className="text-muted small mb-4">Are you sure you want to approve this expense request?</p>
                <div className="d-flex justify-content-center gap-2">
                  <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border fw-medium text-dark" onClick={() => setShowApproveConfirm(false)}>Cancel</button>
                  <button type="button" className="btn btn-success btn-sm px-4 rounded-2 fw-medium" onClick={handleApprove}>Approve Expense</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {showRejectConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4">
                <h6 className="modal-title fw-bold text-dark mb-0">Reject Expense Request</h6>
                <button type="button" className="btn-close" onClick={() => setShowRejectConfirm(false)}></button>
              </div>
              <form onSubmit={handleReject}>
                <div className="modal-body p-4">
                  <label className="form-label small fw-medium text-dark">Reason for rejection <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Provide a reason for rejecting this expense..." 
                    required 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer border-top p-3 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border fw-medium text-dark" onClick={() => setShowRejectConfirm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger btn-sm px-4 rounded-2 fw-medium">Reject Expense</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div className="toast show align-items-center text-white bg-dark border-0 rounded-3 shadow" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body fw-medium">
                <i className="bi-info-circle me-2"></i>{toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpensesPage;
