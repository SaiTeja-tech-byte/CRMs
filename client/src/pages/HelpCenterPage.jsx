import React, { useState, useEffect, useRef } from "react";
import ticketService from "../services/ticketService";
import { onSocketEvent } from "../services/socketService";

const HelpCenterPage = () => {
  const [tickets, setTickets] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "Medium",
    description: ""
  });
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const replyFileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const categories = [
    "Technical Issue", "Account Access", "Software Bug", 
    "Hardware", "HR", "Finance", "Expense", "Documents", "Other"
  ];

  useEffect(() => {
    fetchTickets();
    const unsubNew = onSocketEvent("ticket:new", handleSocketEvent);
    const unsubUpdate = onSocketEvent("ticket:updated", handleSocketEvent);
    return () => {
      unsubNew();
      unsubUpdate();
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await ticketService.getMyTickets();
      if (res.success) setTickets(res.tickets);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSocketEvent = (eventData) => {
    fetchTickets();
    // Also update selected ticket live if open
    if (selectedTicket && eventData && eventData.id === selectedTicket.id) {
      setSelectedTicket(eventData);
    }
  };

  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === "Open" || t.status === "Assigned" || t.status === "Waiting for Employee").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const resolved = tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case "Open": return "bg-primary";
      case "Assigned": return "bg-info text-dark";
      case "In Progress": return "bg-warning text-dark";
      case "Waiting for Employee": return "bg-danger";
      case "Resolved": return "bg-success";
      case "Closed": return "bg-secondary";
      default: return "bg-secondary";
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High": return "text-danger fw-bold";
      case "Medium": return "text-warning fw-bold";
      case "Low": return "text-success fw-bold";
      default: return "text-muted";
    }
  };

  // File Upload Handlers
  const handleFileChange = async (e, setFilesState, filesState) => {
    if (e.target.files && e.target.files.length > 0) {
      const filePromises = Array.from(e.target.files).map(f => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: f.name,
              size: (f.size / 1024).toFixed(1) + " KB",
              fileUrl: event.target.result,
              progress: 100
            });
          };
          reader.readAsDataURL(f);
        });
      });
      const newFiles = await Promise.all(filePromises);
      setFilesState([...filesState, ...newFiles]);
    }
  };

  const removeFile = (index, setFilesState, filesState) => {
    const updated = [...filesState];
    updated.splice(index, 1);
    setFilesState(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.subject || !formData.category || !formData.priority || !formData.description) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        attachments: files
      };
      const res = await ticketService.createTicket(payload);
      if (res && res.success) {
        setShowSubmitModal(false);
        setFormData({ subject: "", category: "", priority: "Medium", description: "" });
        setFiles([]);
        fetchTickets();
        setToastMessage("Support ticket submitted successfully.");
        setTimeout(() => setToastMessage(""), 3000);
      } else {
        setSubmitError(res?.message || "Unable to submit support ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitError(error.response?.data?.message || "Unable to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && replyFiles.length === 0) return;
    try {
      const payload = { text: replyText, attachments: replyFiles };
      const res = await ticketService.replyToTicket(selectedTicket.id, payload);
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyText("");
        setReplyFiles([]);
        fetchTickets();
      }
    } catch (error) {
      console.error("Error replying to ticket:", error);
    }
  };
  
  const handleCloseTicket = async () => {
    try {
      const res = await ticketService.updateTicketStatus(selectedTicket.id, { status: "Closed" });
      if (res.success) {
        setSelectedTicket(res.ticket);
        fetchTickets();
        setToastMessage("Ticket closed.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  const openDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show position-fixed top-0 end-0 m-4 align-items-center text-white bg-success border-0 shadow-lg" style={{ zIndex: 1055, borderRadius: '8px' }}>
          <div className="d-flex">
            <div className="toast-body fw-medium px-3 py-2"><i className="bi-check-circle me-2"></i>{toastMessage}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")}></button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Help Center</h4>
          <p className="text-muted small mb-0">Raise support requests and track their progress.</p>
        </div>
        <button className="btn btn-primary btn-sm px-4 rounded-2 fw-medium shadow-sm d-flex align-items-center gap-2" onClick={() => setShowSubmitModal(true)}>
          <i className="bi-plus-lg"></i> New Ticket
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Tickets", value: totalTickets },
          { label: "Open", value: openCount },
          { label: "In Progress", value: inProgress },
          { label: "Resolved", value: resolved },
        ].map((stat, idx) => (
          <div className="col-6 col-md-3" key={idx}>
            <div className="card border-0 shadow-sm rounded-2 h-100">
              <div className="card-body p-3 text-center">
                <div className="text-muted small fw-medium mb-1">{stat.label}</div>
                <div className="fs-4 fw-bold text-dark">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          
          {/* Filters */}
          <div className="p-3 border-bottom bg-white d-flex flex-wrap gap-3 align-items-center rounded-top-3">
            <div className="input-group input-group-sm" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0"><i className="bi-search text-muted"></i></span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search tickets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="form-select form-select-sm w-auto text-muted" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Employee">Waiting for Employee</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select className="form-select form-select-sm w-auto text-muted" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">Category: All</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto text-muted" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Table */}
          {filteredTickets.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light text-muted small">
                  <tr>
                    <th className="fw-medium border-0 py-3 ps-4">Ticket ID</th>
                    <th className="fw-medium border-0 py-3">Subject</th>
                    <th className="fw-medium border-0 py-3">Category</th>
                    <th className="fw-medium border-0 py-3">Priority</th>
                    <th className="fw-medium border-0 py-3">Created On</th>
                    <th className="fw-medium border-0 py-3">Status</th>
                    <th className="fw-medium border-0 py-3">Assigned To</th>
                    <th className="fw-medium border-0 py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="ps-4 text-muted small">{ticket.id.substring(0, 8).toUpperCase()}</td>
                      <td className="fw-medium text-dark">{ticket.subject}</td>
                      <td><span className="text-muted small">{ticket.category}</span></td>
                      <td><span className={getPriorityClass(ticket.priority)} style={{ fontSize: '0.8rem' }}>{ticket.priority}</span></td>
                      <td><span className="text-muted small">{ticket.createdDate}</span></td>
                      <td><span className={`badge rounded-pill fw-medium ${getBadgeClass(ticket.status)}`}>{ticket.status}</span></td>
                      <td><span className="text-muted small">{ticket.assignedToName || 'Unassigned'}</span></td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-light btn-sm text-primary rounded-2 px-3 fw-medium border shadow-sm" onClick={() => openDetails(ticket)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="py-4">
                <h6 className="fw-bold text-dark mb-1">No tickets found.</h6>
                <p className="text-muted small mb-0">You have no support tickets matching this criteria.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showSubmitModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold text-dark">Submit Support Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setShowSubmitModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {submitError && (
                  <div className="alert alert-danger py-2 px-3 small mb-3">
                    <i className="bi-exclamation-triangle-fill me-2"></i>
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-12">
                      <label className="form-label small fw-medium">Subject <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Category <span className="text-danger">*</span></label>
                      <select className="form-select form-select-sm" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Priority <span className="text-danger">*</span></label>
                      <select className="form-select form-select-sm" required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium">Description <span className="text-danger">*</span></label>
                      <textarea className="form-control form-control-sm" rows="4" required placeholder="Describe your issue in detail..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Upload Attachments</h6>
                  <div 
                    className="border border-2 border-dashed rounded-3 p-4 text-center mb-3 bg-light"
                    onDragOver={(e) => e.preventDefault()}
                    style={{ borderStyle: 'dashed', borderColor: '#dee2e6' }}
                  >
                    <i className="bi-cloud-arrow-up text-primary mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    <p className="small text-muted mb-3">Accepted formats: PDF, JPG, JPEG, PNG, DOCX</p>
                    <input type="file" multiple className="d-none" ref={fileInputRef} onChange={(e) => handleFileChange(e, setFiles, files)} accept=".pdf,.jpg,.jpeg,.png,.docx" />
                    <button type="button" className="btn btn-outline-primary btn-sm px-4 rounded-2 bg-white" onClick={() => fileInputRef.current.click()}>Browse Files</button>
                  </div>

                  {files.length > 0 && (
                    <div className="mb-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-2 border rounded-2 mb-2 bg-white shadow-sm">
                          <div className="d-flex align-items-center">
                            <i className="bi-file-earmark-text text-primary me-2"></i>
                            <div className="small fw-medium">{file.name} ({file.size})</div>
                          </div>
                          <button type="button" className="btn btn-sm text-danger p-0" onClick={() => removeFile(idx, setFiles, files)}><i className="bi-trash"></i></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-4 border-top">
                    <button type="button" className="btn btn-light btn-sm px-4 rounded-2 fw-medium text-dark border" onClick={() => setShowSubmitModal(false)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm px-4 rounded-2 fw-medium" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                      ) : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center bg-light rounded-top-3">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="modal-title fw-bold text-dark mb-0">{selectedTicket.subject}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-muted small">ID: {selectedTicket.id.substring(0,8).toUpperCase()}</span>
                    <span className="text-muted small">Created: {selectedTicket.createdDate}</span>
                    <span className={`badge rounded-pill fw-medium ${getBadgeClass(selectedTicket.status)}`}>{selectedTicket.status}</span>
                  </div>
                </div>
              </div>
              <div className="modal-body p-0 d-flex flex-column flex-md-row bg-white">
                
                {/* Left Column: Details */}
                <div className="p-4 border-end" style={{ flex: '1' }}>
                  <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide">Ticket Details</h6>
                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex"><div className="text-muted small" style={{ width: '120px' }}>Category:</div><div className="fw-medium text-dark small">{selectedTicket.category}</div></div>
                    <div className="d-flex"><div className="text-muted small" style={{ width: '120px' }}>Priority:</div><div className="small"><span className={getPriorityClass(selectedTicket.priority)}>{selectedTicket.priority}</span></div></div>
                    <div className="d-flex"><div className="text-muted small" style={{ width: '120px' }}>Assigned To:</div><div className="fw-medium text-dark small">{selectedTicket.assignedToName || 'Unassigned'}</div></div>
                  </div>
                  
                  <h6 className="fw-bold mb-2 small text-muted text-uppercase tracking-wide">Description</h6>
                  <div className="p-3 bg-light rounded-2 small text-dark mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.description}
                  </div>

                  {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                    <div className="mb-4">
                       <h6 className="fw-bold mb-2 small text-muted text-uppercase tracking-wide">Attachments</h6>
                       <div className="d-flex flex-wrap gap-2">
                         {selectedTicket.attachments.map((file, idx) => (
                           <a key={idx} href={file.fileUrl} download={file.name} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                             <i className="bi-file-earmark-text"></i> {file.name}
                           </a>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* Timeline (simple) */}
                  <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide">Timeline</h6>
                  <div className="ms-2 ps-3 border-start border-2 border-primary position-relative pb-2">
                    <div className="position-absolute translate-middle-x bg-primary rounded-circle" style={{ width: '10px', height: '10px', left: '-1px', top: '0' }}></div>
                    <p className="mb-0 fw-medium text-dark small">Ticket Submitted</p>
                    <p className="text-muted mb-3" style={{ fontSize: '0.75rem' }}>{selectedTicket.createdDate}</p>
                    
                    {selectedTicket.assignedToId && (
                      <>
                        <div className="position-absolute translate-middle-x bg-info rounded-circle" style={{ width: '10px', height: '10px', left: '-1px', marginTop: '4px' }}></div>
                        <p className="mb-0 fw-medium text-dark small">Assigned</p>
                        <p className="text-muted mb-3" style={{ fontSize: '0.75rem' }}></p>
                      </>
                    )}

                    {selectedTicket.status === "Resolved" || selectedTicket.status === "Closed" ? (
                      <>
                        <div className="position-absolute translate-middle-x bg-success rounded-circle" style={{ width: '10px', height: '10px', left: '-1px', marginTop: '4px' }}></div>
                        <p className="mb-0 fw-medium text-dark small">Resolved</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}></p>
                      </>
                    ) : null}
                  </div>
                  
                  {selectedTicket.status !== "Closed" && (
                    <div className="mt-4 pt-3 border-top">
                      <button className="btn btn-outline-danger btn-sm fw-medium w-100" onClick={handleCloseTicket}>
                        Close Ticket
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Conversation */}
                <div className="p-4 bg-light d-flex flex-column" style={{ flex: '1.5', maxHeight: '600px' }}>
                  <h6 className="fw-bold mb-3 small text-muted text-uppercase tracking-wide">Conversation</h6>
                  <div className="flex-grow-1 overflow-auto pe-2 d-flex flex-column gap-3 mb-3">
                    {/* Render Replies */}
                    {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                      <div className="text-center text-muted small my-auto">No replies yet.</div>
                    ) : (
                      selectedTicket.replies.map(reply => (
                        <div key={reply.id} className={`d-flex flex-column ${reply.senderRole === 'employee' ? 'align-items-end' : 'align-items-start'}`}>
                          <div className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                            <span className="fw-bold">{reply.senderName}</span> • {new Date(reply.createdAt).toLocaleString()}
                          </div>
                          <div className={`p-2 px-3 rounded-3 small ${reply.senderRole === 'employee' ? 'bg-primary text-white' : 'bg-white border text-dark'}`} style={{ maxWidth: '85%', whiteSpace: 'pre-wrap' }}>
                            {reply.text}
                          </div>
                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mt-1 justify-content-end">
                              {reply.attachments.map((f, i) => (
                                <a key={i} href={f.fileUrl} download={f.name} className="badge bg-secondary text-decoration-none">
                                  <i className="bi-paperclip"></i> {f.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Reply Box */}
                  {selectedTicket.status !== "Closed" ? (
                    <div className="mt-auto bg-white border rounded-3 p-2 shadow-sm">
                      <form onSubmit={handleReplySubmit}>
                        <textarea className="form-control border-0 shadow-none small" rows="2" placeholder="Type a reply..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{ resize: 'none' }}></textarea>
                        
                        {replyFiles.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-2 px-2 pb-2">
                            {replyFiles.map((file, idx) => (
                              <span key={idx} className="badge bg-light text-dark border d-flex align-items-center gap-1">
                                {file.name} <i className="bi-x text-danger" style={{cursor:'pointer'}} onClick={() => removeFile(idx, setReplyFiles, replyFiles)}></i>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mt-2 px-2 pb-1 border-top pt-2">
                          <div>
                            <input type="file" multiple className="d-none" ref={replyFileInputRef} onChange={(e) => handleFileChange(e, setReplyFiles, replyFiles)} />
                            <button type="button" className="btn btn-sm btn-link text-muted p-0 text-decoration-none" onClick={() => replyFileInputRef.current.click()}>
                              <i className="bi-paperclip fs-5"></i>
                            </button>
                          </div>
                          <button type="submit" className="btn btn-primary btn-sm px-4 rounded-pill fw-medium">Reply</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-auto text-center p-3 bg-white border rounded-3 text-muted small fw-medium">
                      This ticket has been closed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenterPage;
