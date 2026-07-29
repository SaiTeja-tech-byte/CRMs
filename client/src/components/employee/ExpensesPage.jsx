import React, { useState, useRef } from "react";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]); // Start empty
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    amount: "",
    paymentMethod: "",
    description: ""
  });
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    "Travel", "Fuel", "Internet", "Meals", "Accommodation",
    "Office Supplies", "Client Meeting", "Training", 
    "Software Subscription", "Medical", "Other"
  ];

  // Summary Metrics
  const totalClaims = expenses.length;
  const pending = expenses.filter(e => e.status === "Pending").length;
  const approved = expenses.filter(e => e.status === "Approved").length;
  const rejected = expenses.filter(e => e.status === "Rejected").length;
  const reimbursedAmt = expenses
    .filter(e => e.status === "Reimbursed")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // File Upload Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
        progress: 100 // Mock upload progress
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
        progress: 100
      }));
      setFiles([...files, ...newFiles]);
    }
  };
  
  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: "EXP-" + Math.floor(1000 + Math.random() * 9000),
      ...formData,
      status: "Pending",
      receipts: files,
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setExpenses([newExpense, ...expenses]);
    setShowSubmitModal(false);
    setFormData({ title: "", category: "", date: "", amount: "", paymentMethod: "", description: "" });
    setFiles([]);
  };

  const openDetails = (expense) => {
    setSelectedExpense(expense);
    setShowDetailsModal(true);
  };

  // Render Helpers
  const getBadgeClass = (status) => {
    switch (status) {
      case "Pending": return "bg-warning text-dark";
      case "Approved": return "bg-success";
      case "Rejected": return "bg-danger";
      case "Reimbursed": return "bg-info text-dark";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid px-2 py-3" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="mb-1 fw-bold text-dark">Expenses</h4>
          <p className="text-muted mb-0 small">Manage and track your expense reimbursement requests.</p>
        </div>
        <button className="btn btn-primary btn-sm px-3 shadow-sm rounded-2" onClick={() => setShowSubmitModal(true)}>
          <i className="bi-plus-lg me-2"></i>Submit Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Claims", value: totalClaims, icon: "bi-receipt", color: "text-primary" },
          { label: "Pending", value: pending, icon: "bi-hourglass-split", color: "text-warning" },
          { label: "Approved", value: approved, icon: "bi-check-circle", color: "text-success" },
          { label: "Rejected", value: rejected, icon: "bi-x-circle", color: "text-danger" },
          { label: "Reimbursed", value: `₹${reimbursedAmt.toFixed(2)}`, icon: "bi-cash-coin", color: "text-info" },
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

      {/* Toolbar */}
      <div className="card border-0 shadow-sm rounded-2 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi-search"></i>
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control form-control-sm text-muted" />
            </div>
            <div className="col-6 col-md-2 text-md-end">
              <button className="btn btn-outline-secondary btn-sm w-100 d-flex justify-content-between align-items-center">
                Sort: Latest <i className="bi-sort-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {expenses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-2 text-center py-5">
          <div className="card-body py-5">
            <div className="display-4 text-muted mb-3"><i className="bi-inbox"></i></div>
            <h5 className="fw-bold text-dark">No expense claims found</h5>
            <p className="text-muted mb-4">You haven't submitted any expense reimbursement requests yet.</p>
            <button className="btn btn-primary btn-sm px-4 rounded-2 py-2" onClick={() => setShowSubmitModal(true)}>
              Submit Your First Expense
            </button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-2">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="fw-medium border-0 py-3 ps-3">Expense Title</th>
                  <th className="fw-medium border-0 py-3">Category</th>
                  <th className="fw-medium border-0 py-3">Date</th>
                  <th className="fw-medium border-0 py-3">Amount</th>
                  <th className="fw-medium border-0 py-3">Receipt</th>
                  <th className="fw-medium border-0 py-3">Status</th>
                  <th className="fw-medium border-0 py-3 pe-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="ps-3 fw-medium text-dark">{exp.title}</td>
                    <td><span className="text-muted small">{exp.category}</span></td>
                    <td><span className="text-muted small">{exp.date}</span></td>
                    <td className="fw-bold text-dark">₹{parseFloat(exp.amount).toFixed(2)}</td>
                    <td>
                      {exp.receipts && exp.receipts.length > 0 ? (
                        <span className="text-primary small"><i className="bi-paperclip me-1"></i>{exp.receipts.length}</span>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge rounded-pill fw-medium ${getBadgeClass(exp.status)}`}>{exp.status}</span>
                    </td>
                    <td className="pe-3 text-end">
                      <button className="btn btn-light btn-sm text-primary rounded-2 px-3 fw-medium border shadow-sm" onClick={() => openDetails(exp)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submit Expense Modal */}
      {showSubmitModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold text-dark">Submit Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowSubmitModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Expense Information</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Expense Title <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm" required placeholder="e.g. Client Dinner" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Category <span className="text-danger">*</span></label>
                      <select className="form-select form-select-sm" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Expense Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control form-control-sm text-muted" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Amount <span className="text-danger">*</span></label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light text-muted border-end-0">₹</span>
                        <input type="number" step="0.01" className="form-control border-start-0 ps-0" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Payment Method <span className="text-danger">*</span></label>
                      <select className="form-select form-select-sm" required value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                        <option value="">Select Method</option>
                        <option value="Corporate Card">Corporate Card</option>
                        <option value="Personal Card">Personal Card</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium">Description</label>
                      <textarea className="form-control form-control-sm" rows="2" placeholder="Brief details about the expense" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Upload Bills / Receipts</h6>
                  <div 
                    className="border border-2 border-dashed rounded-3 p-4 text-center mb-3 bg-light"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{ borderStyle: 'dashed', borderColor: '#dee2e6' }}
                  >
                    <i className="bi-cloud-arrow-up text-primary mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    <p className="mb-1 fw-medium text-dark">Drag & Drop your files here</p>
                    <p className="small text-muted mb-3">Accepted formats: PDF, JPG, JPEG, PNG</p>
                    <input type="file" multiple className="d-none" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    <button type="button" className="btn btn-outline-primary btn-sm px-4 rounded-2 bg-white" onClick={() => fileInputRef.current.click()}>Browse Files</button>
                  </div>

                  {files.length > 0 && (
                    <div className="mb-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-2 border rounded-2 mb-2 bg-white shadow-sm">
                          <div className="d-flex align-items-center overflow-hidden">
                            <i className="bi-file-earmark-text text-primary me-3 fs-5 ms-1"></i>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              <div className="small fw-medium text-dark text-truncate">{file.name}</div>
                              <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{file.size}</div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center">
                                <span className="small text-muted me-2" style={{ fontSize: '0.7rem' }}>100%</span>
                                <div className="progress" style={{ width: '60px', height: '4px' }}>
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${file.progress}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <button type="button" className="btn btn-sm text-primary p-0 me-2" title="Preview"><i className="bi-eye"></i></button>
                                <button type="button" className="btn btn-sm text-danger p-0" title="Remove" onClick={() => removeFile(idx)}><i className="bi-trash"></i></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-4 border-top">
                    <button type="button" className="btn btn-light btn-sm px-4 rounded-2 fw-medium text-dark border" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm px-4 rounded-2 fw-medium">Submit Request</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Drawer / Modal */}
      {showDetailsModal && selectedExpense && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header bg-light border-bottom py-3 px-4">
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-1">{selectedExpense.title}</h5>
                  <div className="d-flex align-items-center gap-3 small">
                    <span className="text-muted">ID: {selectedExpense.id}</span>
                    <span className="text-muted"><i className="bi-calendar me-1"></i>{selectedExpense.submittedDate}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className={`badge px-3 py-2 rounded-pill fw-medium ${getBadgeClass(selectedExpense.status)}`}>{selectedExpense.status}</span>
                  <button type="button" className="btn-close ms-2" onClick={() => setShowDetailsModal(false)}></button>
                </div>
              </div>
              <div className="modal-body p-4 bg-white">
                <div className="row mb-2">
                  <div className="col-md-8 mb-4 mb-md-0">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Expense Details</h6>
                    <div className="card border-0 bg-light rounded-3 p-4 mb-4">
                      <div className="row g-4">
                        <div className="col-6">
                          <p className="small text-muted mb-1">Category</p>
                          <p className="fw-medium text-dark mb-0">{selectedExpense.category}</p>
                        </div>
                        <div className="col-6">
                          <p className="small text-muted mb-1">Amount</p>
                          <p className="fw-bold text-dark mb-0 fs-5">₹{parseFloat(selectedExpense.amount).toFixed(2)}</p>
                        </div>
                        <div className="col-6">
                          <p className="small text-muted mb-1">Expense Date</p>
                          <p className="fw-medium text-dark mb-0">{selectedExpense.date}</p>
                        </div>
                        <div className="col-6">
                          <p className="small text-muted mb-1">Payment Method</p>
                          <p className="fw-medium text-dark mb-0">{selectedExpense.paymentMethod}</p>
                        </div>
                        <div className="col-12">
                          <p className="small text-muted mb-1">Description</p>
                          <p className="fw-medium text-dark mb-0">{selectedExpense.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Uploaded Receipts</h6>
                    {selectedExpense.receipts && selectedExpense.receipts.length > 0 ? (
                      <div className="row g-3">
                        {selectedExpense.receipts.map((file, idx) => (
                          <div className="col-sm-6" key={idx}>
                            <div className="border rounded-2 p-2 d-flex align-items-center justify-content-between bg-white shadow-sm">
                              <div className="d-flex align-items-center overflow-hidden">
                                <i className="bi-file-earmark-image text-primary me-2 fs-5 ms-1"></i>
                                <div className="text-truncate">
                                  <div className="small fw-medium text-dark text-truncate" style={{ maxWidth: '120px' }}>{file.name}</div>
                                </div>
                              </div>
                              <div className="d-flex gap-1 ms-2">
                                <button className="btn btn-sm btn-light p-1 border" title="Preview"><i className="bi-eye text-secondary"></i></button>
                                <button className="btn btn-sm btn-light p-1 border" title="Download"><i className="bi-download text-primary"></i></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-light rounded-2 text-center">
                        <p className="text-muted small mb-0">No receipts uploaded.</p>
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Status Timeline</h6>
                    <div className="position-relative ms-2 ps-3 pb-2" style={{ borderLeft: '2px solid #dee2e6' }}>
                      <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0d6efd', top: '0' }}></div>
                      <div className="mb-4">
                        <p className="mb-0 fw-bold text-dark small">Submitted</p>
                        <p className="text-muted small mb-0">{selectedExpense.submittedDate}</p>
                      </div>

                      <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedExpense.status !== 'Pending' ? '#198754' : '#ffc107', top: '55px' }}></div>
                      <div className="mb-4">
                        <p className="mb-0 fw-bold text-dark small">Pending Review</p>
                        <p className="text-muted small mb-0">Finance Team</p>
                      </div>

                      {(selectedExpense.status === 'Approved' || selectedExpense.status === 'Reimbursed') && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedExpense.status === 'Reimbursed' ? '#198754' : '#ffc107', top: '110px' }}></div>
                          <div className="mb-4">
                            <p className="mb-0 fw-bold text-dark small">Approved</p>
                            <p className="text-muted small mb-0">Manager</p>
                          </div>
                        </>
                      )}

                      {selectedExpense.status === 'Rejected' && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#dc3545', top: '110px' }}></div>
                          <div className="mb-4">
                            <p className="mb-0 fw-bold text-danger small">Rejected</p>
                            <div className="mt-2 p-3 bg-danger bg-opacity-10 rounded-2 border border-danger border-opacity-25">
                              <p className="small text-danger fw-bold mb-1">Admin Remarks:</p>
                              <p className="small text-dark mb-0">Receipt is missing or unclear, please re-upload.</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {selectedExpense.status === 'Reimbursed' && (
                        <>
                          <div className="position-absolute start-0 translate-middle mt-1" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#198754', top: '165px' }}></div>
                          <div>
                            <p className="mb-0 fw-bold text-success small">Reimbursed</p>
                            <p className="text-muted small mb-0">Payment Processed</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpensesPage;
