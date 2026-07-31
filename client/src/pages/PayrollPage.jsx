import React, { useState, useEffect } from "react";
import payrollService from "../services/payrollService";
import { onSocketEvent } from "../services/socketService";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchPayrolls = async () => {
    try {
      const res = await payrollService.getMyPayrolls();
      if (res.success) setPayrolls(res.payrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    
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

  const filteredPayrolls = payrolls.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === "All" || p.payPeriodMonth === monthFilter;
    const matchesYear = yearFilter === "All" || p.payPeriodYear.toString() === yearFilter;
    return matchesSearch && matchesMonth && matchesYear;
  });

  // Calculate summaries
  const sortedByDate = [...payrolls].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latestPayroll = sortedByDate[0];
  const currentSalary = latestPayroll ? latestPayroll.grossSalary : 0;
  
  const currentMonthName = months[new Date().getMonth()];
  const thisMonthPayroll = payrolls.find(p => p.payPeriodMonth === currentMonthName && p.payPeriodYear === currentYear);
  const thisMonthNetPay = thisMonthPayroll ? thisMonthPayroll.netSalary : 0;
  
  const totalPayslips = payrolls.length;
  
  const paidPayrolls = sortedByDate.filter(p => p.status === "Paid" && p.paymentDate);
  const lastPaymentDate = paidPayrolls.length > 0 ? new Date(paidPayrolls[0].paymentDate).toLocaleDateString() : "N/A";

  const getStatusBadge = (status) => {
    switch(status) {
      case "Paid": return "bg-success";
      case "Processed": return "bg-info text-dark";
      case "Pending": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  const handleDownload = (e, payroll) => {
    e.stopPropagation();
    alert(`Downloading PDF for payslip ${payroll.id.substring(0,8).toUpperCase()}...`);
    // In a real app, use jsPDF or html2pdf
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Payroll</h4>
          <p className="text-muted mb-0 small">View your salary, payslips, deductions, and payment history.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Current Salary", value: `₹${currentSalary.toLocaleString()}` },
          { label: "This Month Net Pay", value: `₹${thisMonthNetPay.toLocaleString()}` },
          { label: "Total Payslips", value: totalPayslips },
          { label: "Last Payment Date", value: lastPaymentDate },
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
        {/* Filters */}
        <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap gap-3 align-items-center rounded-top-3">
          <div className="input-group input-group-sm" style={{ width: "250px" }}>
            <span className="input-group-text bg-white border-end-0"><i className="bi-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0 ps-0" placeholder="Search Payslip ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-select form-select-sm w-auto text-muted" value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
            <option value="All">Month: All</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto text-muted" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="All">Year: All</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small uppercase tracking-wide">
                <tr>
                  <th className="ps-4 fw-medium border-0">Payslip ID</th>
                  <th className="fw-medium border-0">Pay Period</th>
                  <th className="fw-medium border-0">Gross Salary</th>
                  <th className="fw-medium border-0">Deductions</th>
                  <th className="fw-medium border-0">Net Salary</th>
                  <th className="fw-medium border-0">Payment Date</th>
                  <th className="fw-medium border-0">Status</th>
                  <th className="pe-4 text-end fw-medium border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.length > 0 ? (
                  filteredPayrolls.map(p => (
                    <tr key={p.id}>
                      <td className="ps-4 text-dark small fw-medium">{p.id.substring(0,8).toUpperCase()}</td>
                      <td className="small text-muted">{p.payPeriodMonth} {p.payPeriodYear}</td>
                      <td className="small text-dark fw-medium">₹{p.grossSalary.toLocaleString()}</td>
                      <td className="small text-danger">₹{((p.grossSalary || 0) - (p.netSalary || 0)).toLocaleString()}</td>
                      <td className="small text-success fw-bold">₹{p.netSalary.toLocaleString()}</td>
                      <td className="small text-muted">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <span className={`badge rounded-pill fw-medium ${getStatusBadge(p.status)}`}>{p.status}</span>
                      </td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-sm btn-light text-primary border me-2" onClick={() => { setSelectedPayroll(p); setShowDetailsModal(true); }}>
                          <i className="bi-eye"></i> View
                        </button>
                        <button className="btn btn-sm btn-light text-muted border" onClick={(e) => handleDownload(e, p)}>
                          <i className="bi-download"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <h6 className="fw-medium text-dark mb-1">No payroll records found.</h6>
                      <p className="small text-muted mb-0">Your salary details and payslips will appear here once payroll is processed.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
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

export default PayrollPage;