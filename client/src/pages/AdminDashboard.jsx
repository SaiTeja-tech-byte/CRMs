import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCRMContext } from "../context/CRMContext";
import "../styles/dashboard-layout.css";

import Sidebar from "../components/layout/Sidebar";
import { adminGetAllTasks, adminAssignTask, adminDeleteTask, adminGetEmployees } from '../services/taskService';
import { getAdminStats, getAdminUsers, updateAdminUser } from '../services/adminService';
import { getCompanySettings, updateCompanySettings } from '../services/companySettingsService';
import { getDocuments, createDocument, deleteDocument, fileToDataUrl, formatFileSize } from '../services/documentService';
import { getNews, createNews, deleteNews } from '../services/newsService';
import { createAdminUser } from '../services/adminService';
import { adminGetAllEvents, adminAssignEvent, adminDeleteEvent } from '../services/eventService';
import { onSocketEvent, connectSocket, disconnectSocket } from '../services/socketService';
import { describeApiError } from '../services/errorHelper';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../services/leaveService';
import AdminOrganizationChart from './AdminOrganizationChart';
import GlobalSearch from '../components/layout/GlobalSearch';
import ChatPage from './ChatPage';
// =========================
// AdminHome
// =========================
const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = () => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => {
    loadStats();
    const unsubscribers = [
      onSocketEvent("task:new", loadStats),
      onSocketEvent("task:updated", loadStats),
      onSocketEvent("task:deleted", loadStats),
      onSocketEvent("event:new", loadStats),
      onSocketEvent("event:deleted", loadStats),
      onSocketEvent("document:new", loadStats),
      onSocketEvent("news:new", loadStats),
      onSocketEvent("team:updated", loadStats),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const profile = {
    avatar: "", // Admin avatar
    firstName: "Admin",
    lastName: "User",
    displayName: "Administrator",
    designation: "System Administrator",
    department: "Management",
    employmentStatus: "Active",
    employeeId: "",
    company: "",
    officeLocation: "",
    officialEmail: "",
    phoneNumber: "",
    joiningDate: ""
  };

  const totalEmployees = stats?.totalEmployees || 0;
  const activeEmployees = stats?.activeEmployees || 0;

  const systemUsage = stats
    ? Math.min(
        100,
        Math.round(
          ((totalEmployees + (stats.documents || 0) + (stats.newsPosts || 0)) / 50) * 100
        )
      )
    : 0;

  const employeeActivity = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  const teamOnLeave = [];
  const leaveRequests = [];

  return (
    <>
      <style>{`
        /* ── Employee Workspace Dashboard ── */
        .ew-root {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 24px;
          background: #f5f7fb;
          min-height: 100%;
          box-sizing: border-box;
        }

        /* LEFT COLUMN */
        .ew-left {
          width: 280px;
          min-width: 260px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* RIGHT COLUMN */
        .ew-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        /* Card base */
        .ew-card {
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 1px 6px rgba(15,23,42,0.06);
          border: 1px solid #eef0f6;
          overflow: hidden;
        }

        /* ── Profile Card ── */
        .ew-profile-card {
          padding: 24px 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ew-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 12px;
          flex-shrink: 0;
        }
        .ew-profile-name {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 3px;
          line-height: 1.3;
        }
        .ew-profile-designation {
          font-size: 12px;
          color: #2563eb;
          font-weight: 600;
          margin: 0 0 2px;
        }
        .ew-profile-dept {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 500;
          margin: 0 0 14px;
        }
        .ew-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ecfdf5;
          color: #059669;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .ew-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }
        .ew-divider {
          width: 100%;
          height: 1px;
          background: #f1f5f9;
          margin: 4px 0 14px;
        }
        .ew-info-grid {
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .ew-info-row {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .ew-info-label {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ew-info-value {
          font-size: 12.5px;
          color: #334155;
          font-weight: 500;
          word-break: break-word;
        }
        .ew-info-value.empty {
          color: #cbd5e1;
          font-style: italic;
        }

        /* ── Work Summary Card ── */
        .ew-summary-card {
          padding: 20px 24px;
        }
        .ew-summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .ew-summary-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .ew-summary-date {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .ew-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .ew-summary-item {
          background: #f8fafc;
          border-radius: 10px;
          padding: 13px 14px;
          border: 1px solid #f1f5f9;
        }
        .ew-summary-item-label {
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 5px;
        }
        .ew-summary-item-value {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        /* ── Progress Row ── */
        .ew-progress-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ew-progress-card {
          padding: 20px 22px;
        }
        .ew-progress-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .ew-progress-sub {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          margin: 0 0 16px;
        }
        .ew-progress-bar-wrap {
          height: 8px;
          background: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .ew-progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.4s ease;
        }
        .ew-progress-pct {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        /* ── Leave / Team Row ── */
        .ew-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ew-leave-card {
          padding: 18px 22px;
          min-height: 160px;
        }
        .ew-leave-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px;
        }
        .ew-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px 0 8px;
        }
        .ew-empty-icon {
          width: 44px;
          height: 44px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 20px;
        }
        .ew-empty-text {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          text-align: center;
        }

        @media (max-width: 900px) {
          .ew-root { flex-direction: column; }
          .ew-left { width: 100%; }
          .ew-summary-grid { grid-template-columns: repeat(2, 1fr); }
          .ew-progress-row, .ew-two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .ew-summary-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ew-root">
        <div className="ew-left">
          {/* Profile Card */}
          <div className="ew-card ew-profile-card">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" className="ew-avatar" style={{ display: "flex" }} />
            ) : (
              <div className="ew-avatar">
                {`${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}` || "A"}
              </div>
            )}

            <p className="ew-profile-name">
              {profile?.displayName || "Admin User"}
            </p>
            <p className="ew-profile-designation">{profile?.designation || "Administrator"}</p>
            <p className="ew-profile-dept">{profile?.department || "Management"}</p>

            <div className="ew-status-badge">
              <span className="ew-status-dot" />
              {profile?.employmentStatus || "Active"}
            </div>

            <div className="ew-divider" />

            <div className="ew-info-grid">
              {[
                { label: "Admin ID",          value: profile?.employeeId },
                { label: "Company",           value: profile?.company },
                { label: "Office Location",   value: profile?.officeLocation },
                { label: "Official Email",    value: profile?.officialEmail },
                { label: "Phone Number",      value: profile?.phoneNumber },
                { label: "Role",              value: "Administrator" },
              ].map(({ label, value }) => (
                <div className="ew-info-row" key={label}>
                  <span className="ew-info-label">{label}</span>
                  <span className={`ew-info-value ${!value ? "empty" : ""}`}>
                    {value || "Not set"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ew-right">

          <div className="ew-card ew-summary-card">
            <div className="ew-summary-header">
              <h3 className="ew-summary-title">Today's Work Summary</h3>
              <span className="ew-summary-date">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="ew-summary-grid">
              {[
                { label: "Total Employees",   value: totalEmployees },
                { label: "Pending Tasks",     value: stats?.pendingTasks || 0 },
                { label: "Upcoming Events",   value: stats?.upcomingEvents || 0 },
                { label: "News Posts",        value: stats?.newsPosts || 0 },
                { label: "Documents",         value: stats?.documents || 0 },
                { label: "Notifications",     value: stats?.notifications || 0 },
              ].map(({ label, value }) => (
                <div className="ew-summary-item" key={label}>
                  <div className="ew-summary-item-label">{label}</div>
                  <div className="ew-summary-item-value">{statsLoading ? "—" : value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ew-progress-row">
            <div className="ew-card ew-progress-card">
              <p className="ew-progress-title">System Usage</p>
              <p className="ew-progress-sub">Overall system completion</p>
              <div className="ew-progress-bar-wrap">
                <div
                  className="ew-progress-bar-fill"
                  style={{ width: `${systemUsage}%`, background: "#2563eb" }}
                />
              </div>
              <span className="ew-progress-pct">{systemUsage}%</span>
            </div>

            <div className="ew-card ew-progress-card">
              <p className="ew-progress-title">Employee Activity</p>
              <p className="ew-progress-sub">Active Employees Logged In Today</p>
              <div className="ew-progress-bar-wrap">
                <div
                  className="ew-progress-bar-fill"
                  style={{ width: `${employeeActivity}%`, background: "#10b981" }}
                />
              </div>
              <span className="ew-progress-pct">{employeeActivity}%</span>
            </div>
          </div>

          <div className="ew-two-col">
            <div className="ew-card ew-leave-card">
              <h4 className="ew-leave-title">Team Members On Leave</h4>
              {teamOnLeave.length === 0 ? (
                <div className="ew-empty-state">
                  <div className="ew-empty-icon"><i className="bi bi-people" /></div>
                  <span className="ew-empty-text">No employees on leave.</span>
                </div>
              ) : (
                teamOnLeave.map((m) => (
                  <div key={m.id} style={{ fontSize: "12px", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    {m.name} — <span style={{ color: "#94a3b8" }}>{m.type}</span>
                  </div>
                ))
              )}
            </div>

            <div className="ew-card ew-leave-card">
              <h4 className="ew-leave-title">Leave Requests</h4>
              {leaveRequests.length === 0 ? (
                <div className="ew-empty-state">
                  <div className="ew-empty-icon"><i className="bi bi-calendar-x" /></div>
                  <span className="ew-empty-text">No leave requests.</span>
                </div>
              ) : (
                leaveRequests.map((r) => (
                  <div key={r.id} style={{ fontSize: "12px", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    {r.type} — <span style={{ color: "#94a3b8" }}>{r.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

// =========================
// AdminProfile
// =========================
const AdminProfile = () => {
  const { profile, setProfile } = useCRMContext();
  const [formData, setFormData] = useState({ ...profile });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.officialEmail) {
      setToastMsg("First Name, Last Name, and Email are required.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setProfile(formData);
    setToastMsg("Profile updated successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    setFormData({ ...profile });
  };

  const handleDelete = () => {
    // Frontend only simulation
    setShowDeleteModal(false);
    setToastMsg("Account deletion simulation complete. No data was actually deleted.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="admin-profile-container" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-primary border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-info-circle me-2"></i>{toastMsg}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div>
        <h3 className="fw-bold mb-1" style={{ color: "var(--crm-dark)", fontSize: "22px" }}>My Profile</h3>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Manage your administrator account information.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">
          
          {/* SECTION 1: PROFILE CARD */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-body text-center p-3">
              <div className="mb-3 text-center position-relative d-inline-block">
                {formData.avatar ? <img src={formData.avatar} alt="Profile" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }} /> : 
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#e2e8f0", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", margin: "0 auto" }}>
                    {formData?.firstName?.[0] || ""}{formData?.lastName?.[0] || ""}
                  </div>
                }
                <button className="btn btn-primary rounded-circle position-absolute bottom-0 end-0" style={{ width: "28px", height: "28px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: "translate(25%, 25%)" }}>
                  <i className="bi bi-camera" style={{ fontSize: "14px" }}></i>
                </button>
              </div>
              <h5 className="fw-bold mb-1">{formData.displayName || `${formData.firstName} ${formData.lastName}`}</h5>
              <p className="text-muted mb-2" style={{ fontSize: "14px" }}>{formData.role}</p>
              <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-1 rounded-pill" style={{ fontSize: "12px" }}><i className="bi bi-shield-lock me-1"></i> Administrator</span>
              
              <div className="text-start mt-2 pt-2 border-top">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Admin ID:</span>
                  <span className="fw-semibold small">{formData.employeeId}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Email:</span>
                  <span className="fw-semibold small">{formData.officialEmail || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Phone:</span>
                  <span className="fw-semibold small">{formData.phoneNumber || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Company:</span>
                  <span className="fw-semibold small">{formData.company}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Last Login:</span>
                  <span className="fw-semibold small">{formData.lastLogin}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Status:</span>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2" style={{ fontSize: "11px" }}>{formData.accountStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: PROFILE SUMMARY */}
          {/* SECTION 6: PROFILE SUMMARY */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0 text-muted text-uppercase" style={{ fontSize: "11px" }}>Profile Summary</h6>
            </div>
            <div className="card-body px-3 pb-3 pt-0">
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Profile Completion</span>
                  <span className="fw-bold small text-primary">85%</span>
                </div>
                <div className="progress" style={{ height: "4px" }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Account Status</span>
                <span className="fw-semibold small text-success">Active</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Last Updated</span>
                <span className="fw-semibold small">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Forms */}
        <div className="col-12 col-xl-8 d-flex flex-column gap-3">
          
          {/* SECTION 2: PERSONAL INFORMATION */}
          {/* SECTION 2: PERSONAL INFORMATION */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>Personal Information</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>First Name</label>
                  <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Last Name</label>
                  <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Personal Email</label>
                  <input type="email" className="form-control" name="personalEmail" value={formData.personalEmail} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Phone Number</label>
                  <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Date of Birth</label>
                  <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Gender</label>
                  <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} style={{ height: "34px", fontSize: "13px", padding: "4px 32px 4px 12px" }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Address</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>City</label>
                  <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>State</label>
                  <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Zip Code</label>
                  <input type="text" className="form-control" name="zipCode" value={formData.zipCode} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: WORK INFORMATION */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>Work Information</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Company Name</label>
                  <input type="text" className="form-control" value={formData.company} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Role</label>
                  <input type="text" className="form-control" value={formData.role} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Department</label>
                  <input type="text" className="form-control" value={formData.department || "Administration"} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Admin ID</label>
                  <input type="text" className="form-control" value={formData.employeeId} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Joining Date</label>
                  <input type="text" className="form-control" value={formData.joiningDate} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Company Email</label>
                  <input type="text" className="form-control" value={formData.officialEmail} readOnly style={{ backgroundColor: "#f8f9fa", height: "34px", fontSize: "13px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: SOCIAL LINKS */}
          {/* SECTION 4: SOCIAL LINKS */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>Social Links</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>LinkedIn</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light px-2" style={{ padding: "0" }}><i className="bi bi-linkedin text-primary" style={{ fontSize: "13px" }}></i></span>
                    <input type="text" className="form-control" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/username" style={{ height: "34px", fontSize: "13px" }} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>GitHub</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light px-2" style={{ padding: "0" }}><i className="bi bi-github" style={{ fontSize: "13px" }}></i></span>
                    <input type="text" className="form-control" name="github" value={formData.github} onChange={handleChange} placeholder="github.com/username" style={{ height: "34px", fontSize: "13px" }} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Portfolio</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light px-2" style={{ padding: "0" }}><i className="bi bi-briefcase" style={{ fontSize: "13px" }}></i></span>
                    <input type="text" className="form-control" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="portfolio.com" style={{ height: "34px", fontSize: "13px" }} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Website</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light px-2" style={{ padding: "0" }}><i className="bi bi-globe" style={{ fontSize: "13px" }}></i></span>
                    <input type="text" className="form-control" name="website" value={formData.website} onChange={handleChange} placeholder="website.com" style={{ height: "34px", fontSize: "13px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: ACCOUNT SETTINGS */}
          {/* SECTION 5: ACCOUNT SETTINGS */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>Account Settings</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Username</label>
                  <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} style={{ height: "34px", fontSize: "13px" }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Preferred Language</label>
                  <select className="form-select" name="language" value={formData.language} onChange={handleChange} style={{ height: "34px", fontSize: "13px", padding: "4px 32px 4px 12px" }}>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>Time Zone</label>
                  <select className="form-select" name="timeZone" value={formData.timeZone} onChange={handleChange} style={{ height: "34px", fontSize: "13px", padding: "4px 32px 4px 12px" }}>
                    <option value="GMT-5:00 (EST)">GMT-5:00 (EST)</option>
                    <option value="GMT+0:00 (UTC)">GMT+0:00 (UTC)</option>
                    <option value="GMT+5:30 (IST)">GMT+5:30 (IST)</option>
                  </select>
                </div>
              </div>
              <h6 className="fw-semibold mb-2" style={{ fontSize: "13px" }}>Notification Preferences</h6>
              <div className="form-check form-switch mb-1">
                <input className="form-check-input" type="checkbox" name="notifEmail" id="notifEmail" checked={formData.notifEmail} onChange={handleChange} />
                <label className="form-check-label text-dark" htmlFor="notifEmail" style={{ fontSize: "13px" }}>Email Notifications</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="notifPush" id="notifPush" checked={formData.notifPush} onChange={handleChange} />
                <label className="form-check-label text-dark" htmlFor="notifPush" style={{ fontSize: "13px" }}>Push Notifications</label>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-between align-items-center mt-2 mb-4">
            <div>
              <button className="btn btn-danger px-4" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light border px-4" onClick={handleReset}>Reset</button>
              <button className="btn btn-primary px-4" onClick={handleSave}>Save Changes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Delete Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0 text-muted">Are you sure you want to permanently delete your administrator account? This action cannot be undone and you will lose access to the CRM immediately.</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// AdminCalendar
// =========================
const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [newEvent, setNewEvent] = useState({
    targetType: "employee", title: "", description: "", date: "", startTime: "", endTime: "", type: "Meeting",
    employeeId: "", department: "", priority: "Medium", location: "", color: "#2563eb"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [eventList, employeeList] = await Promise.all([adminGetAllEvents(), adminGetEmployees()]);
      setEvents(eventList);
      setEmployees(employeeList.filter(e => e.role === "employee"));
    } catch (err) {
      console.error(err);
      setError(describeApiError(err, "Couldn't load calendar events."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribers = [
      onSocketEvent("event:new", () => loadData()),
      onSocketEvent("event:updated", () => loadData()),
      onSocketEvent("event:deleted", () => loadData()),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const handleAddSubmit = async () => {
    if (!newEvent.title || !newEvent.date) {
      setToastMsg("Title and Date are required.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    if (newEvent.targetType === "employee" && !newEvent.employeeId) {
      setToastMsg("Please choose an employee.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    if (newEvent.targetType === "department" && !newEvent.department) {
      setToastMsg("Please choose a department.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    try {
      setSubmitting(true);
      const result = await adminAssignEvent(newEvent);
      await loadData();
      setShowAddModal(false);
      setNewEvent({ targetType: "employee", title: "", description: "", date: "", startTime: "", endTime: "", type: "Meeting", employeeId: "", department: "", priority: "Medium", location: "", color: "#2563eb" });
      setToastMsg(result.count > 1 ? `Event scheduled for ${result.count} employees.` : "Event created successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setToastMsg(describeApiError(err, "Couldn't create the event."));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
      setSelectedEvent(null);
      setToastMsg("Event deleted successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const gridCells = Array.from({ length: Math.ceil((startOffset + daysInMonth) / 7) * 7 }, (_, i) => i - startOffset + 1);

  const filteredEvents = events.filter(e => (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const renderEventPill = (event) => (
    <div key={event.id} onClick={() => setSelectedEvent(event)} className="event-pill" style={{ background: (event.color || "#2563eb") + "20", color: event.color || "#2563eb", borderLeft: `3px solid ${event.color || "#2563eb"}`, padding: "2px 6px", fontSize: "11px", borderRadius: "3px", marginBottom: "4px", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {event.title}
    </div>
  );

  return (
    <div className="admin-calendar-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-primary border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body"><i className="bi bi-info-circle me-2"></i>{toastMsg}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="fw-bold mb-1" style={{ color: "var(--crm-dark)" }}>Calendar Management</h2>
        <p className="text-muted">Schedule meetings and events for a specific employee, a department, or everyone.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
        <div className="card-body p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3 flex-grow-1">
            <div className="position-relative" style={{ minWidth: "250px" }}>
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: "12px" }}></i>
              <input type="text" className="form-control ps-5" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "8px" }} />
            </div>
          </div>
          <button className="btn btn-primary px-3" style={{ borderRadius: "8px" }} onClick={() => setShowAddModal(true)} disabled={loading}><i className="bi bi-plus-lg me-2"></i>Add Event</button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8 d-flex flex-column gap-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "14px", overflow: "hidden" }}>
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">{monthNames[today.getMonth()]} {today.getFullYear()}</h5>
            </div>
            <div className="card-body p-0">
              <div className="calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center py-2 border-bottom border-end bg-light text-muted small fw-semibold text-uppercase">{day}</div>
                ))}
                {gridCells.map((dateNum, idx) => {
                  const isCurrentMonth = dateNum > 0 && dateNum <= daysInMonth;
                  const isToday = isCurrentMonth && dateNum === today.getDate();
                  const cellDateStr = isCurrentMonth
                    ? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`
                    : null;
                  const dayEvents = isCurrentMonth ? filteredEvents.filter(e => e.date === cellDateStr) : [];

                  return (
                    <div key={idx} className="border-bottom border-end p-2" style={{ minHeight: "110px", background: isCurrentMonth ? "#fff" : "#f8fafc" }}>
                      <div className={`text-end mb-1 ${isToday ? 'fw-bold text-primary' : (isCurrentMonth ? 'text-dark' : 'text-muted')}`} style={{ fontSize: "13px" }}>
                        {isToday ? <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>{dateNum}</span> : (isCurrentMonth ? dateNum : "")}
                      </div>
                      <div className="events-container d-flex flex-column gap-1">
                        {dayEvents.map(renderEventPill)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
            <div className="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">All Events</h5>
              <span className="badge bg-primary rounded-pill">{loading ? "—" : filteredEvents.length}</span>
            </div>
            <div className="card-body px-4 pb-4">
              {loading ? (
                <div className="text-center py-4 text-muted">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3"><i className="bi bi-calendar-x text-muted" style={{ fontSize: "36px" }}></i></div>
                  <h6 className="fw-semibold text-dark mb-1">No Events Scheduled</h6>
                  <p className="text-muted small mb-3">There are no upcoming events in the calendar.</p>
                  <button className="btn btn-outline-primary btn-sm px-3" style={{ borderRadius: "6px" }} onClick={() => setShowAddModal(true)}>Create First Event</button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {filteredEvents.map(e => (
                    <div key={e.id} className="d-flex gap-3 align-items-start p-3 border rounded-3" style={{ background: "#fafafa" }}>
                      <div className="text-center px-2 py-1 rounded" style={{ background: (e.color || "#2563eb") + "15", border: `1px solid ${(e.color || "#2563eb")}30`, minWidth: "50px" }}>
                        <div style={{ color: e.color || "#2563eb", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>{e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short' }) : "—"}</div>
                        <div style={{ color: e.color || "#2563eb", fontSize: "18px", fontWeight: "bold", lineHeight: "1" }}>{e.date ? new Date(e.date).getDate() : "—"}</div>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1 text-dark" style={{ cursor: "pointer" }} onClick={() => setSelectedEvent(e)}>{e.title}</h6>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-light text-dark border">{e.type || "Meeting"}</span>
                          <span className="text-muted small"><i className="bi bi-clock me-1"></i>{e.startTime || "All Day"}</span>
                        </div>
                        <p className="text-muted small mb-0"><i className="bi bi-person me-1"></i>{e.assignedTo || "Unassigned"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">Add Calendar Event</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Event Title</label>
                      <input type="text" className="form-control" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Q3 Roadmap Planning" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-semibold">Date</label>
                      <input type="date" className="form-control" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-semibold">Start Time</label>
                      <input type="time" className="form-control" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-semibold">End Time</label>
                      <input type="time" className="form-control" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Assign To</label>
                      <div className="btn-group w-100 mb-2" role="group">
                        {[
                          { key: "employee", label: "Specific Employee" },
                          { key: "department", label: "Whole Department" },
                          { key: "all", label: "Everyone" },
                        ].map(opt => (
                          <button
                            key={opt.key}
                            type="button"
                            className={`btn btn-sm ${newEvent.targetType === opt.key ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setNewEvent({ ...newEvent, targetType: opt.key, employeeId: "", department: "" })}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {newEvent.targetType === "employee" && (
                        <select className="form-select" value={newEvent.employeeId} onChange={e => setNewEvent({...newEvent, employeeId: e.target.value})}>
                          <option value="">Select an employee...</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                          ))}
                        </select>
                      )}
                      {newEvent.targetType === "department" && (
                        <select className="form-select" value={newEvent.department} onChange={e => setNewEvent({...newEvent, department: e.target.value})}>
                          <option value="">Select a department...</option>
                          {departments.map(dep => (<option key={dep} value={dep}>{dep}</option>))}
                        </select>
                      )}
                      {newEvent.targetType === "all" && (
                        <div className="alert alert-info py-2 px-3 mb-0 small">This event will be scheduled for every employee ({employees.length} total).</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Type</label>
                      <select className="form-select" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                        <option>Meeting</option>
                        <option>Holiday</option>
                        <option>Training</option>
                        <option>Company Event</option>
                        <option>Deadline</option>
                        <option>Birthday</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Priority</label>
                      <select className="form-select" value={newEvent.priority} onChange={e => setNewEvent({...newEvent, priority: e.target.value})}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Location</label>
                      <input type="text" className="form-control" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="e.g. Conference Room A or Zoom Link" />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Description</label>
                      <textarea className="form-control" rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold d-block">Event Color</label>
                      <div className="d-flex gap-2">
                        {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                          <div key={c} onClick={() => setNewEvent({...newEvent, color: c})} style={{ width: "30px", height: "30px", borderRadius: "50%", background: c, cursor: "pointer", border: newEvent.color === c ? "2px solid #000" : "2px solid transparent", padding: "2px" }}>
                            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: c }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light border" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddSubmit} disabled={submitting}>{submitting ? "Saving..." : "Save Event"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedEvent && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4" style={{ borderLeft: `5px solid ${selectedEvent.color || "#2563eb"}` }}>
                  <h5 className="modal-title fw-bold">{selectedEvent.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedEvent(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <span className="badge bg-light text-dark border me-2">{selectedEvent.type || "Meeting"}</span>
                    <span className="badge bg-success bg-opacity-10 text-success">{selectedEvent.status}</span>
                  </div>
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex gap-3">
                      <i className="bi bi-calendar-event text-muted fs-5"></i>
                      <div>
                        <div className="fw-semibold">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "No date"}</div>
                        <div className="text-muted small">{selectedEvent.startTime || "All Day"} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <i className="bi bi-geo-alt text-muted fs-5"></i>
                      <div>
                        <div className="fw-semibold">Location</div>
                        <div className="text-muted small">{selectedEvent.location || "TBD"}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <i className="bi bi-person text-muted fs-5"></i>
                      <div>
                        <div className="fw-semibold">Assigned To</div>
                        <div className="text-muted small">{selectedEvent.assignedTo || "Unassigned"} {selectedEvent.department ? `(${selectedEvent.department})` : ""}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-2">Description</h6>
                    <p className="text-muted mb-0">{selectedEvent.description || "No description provided."}</p>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(selectedEvent.id)}>Delete</button>
                  <button type="button" className="btn btn-light border" onClick={() => setSelectedEvent(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

// =========================
// AdminTeam
// =========================
const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [newMember, setNewMember] = useState({
    firstName: "", lastName: "", email: "", phone: "", employeeId: "",
    department: "", designation: "", role: "employee", manager: "", officeLocation: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");
      const users = await getAdminUsers();
      setTeamMembers(users);
    } catch (err) {
      console.error(err);
      setError(describeApiError(err, "Couldn't load the team list."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
    const unsubscribers = [
      onSocketEvent("team:updated", () => loadTeam()),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      alert("First name, last name, and email are required.");
      return;
    }
    try {
      setAdding(true);
      const result = await createAdminUser(newMember);
      setTeamMembers((prev) => [...prev, result.user]);
      setCreatedCredentials({ email: result.user.email, tempPassword: result.tempPassword });
      setNewMember({ firstName: "", lastName: "", email: "", phone: "", employeeId: "", department: "", designation: "", role: "employee", manager: "", officeLocation: "" });
    } catch (err) {
      console.error(err);
      alert(describeApiError(err, "Couldn't create the account."));
    } finally {
      setAdding(false);
    }
  };

  const notify = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const uniqueDepartments = [...new Set(teamMembers.map(m => m.department).filter(Boolean))];
  const activeEmployees = teamMembers.filter(m => m.employmentStatus === 'Active').length;
  const adminCount = teamMembers.filter(m => m.role === 'admin').length;

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = `${m.fullName} ${m.employeeId || ""} ${m.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? m.department === deptFilter : true;
    const matchesRole = roleFilter ? m.role === roleFilter : true;
    const matchesStatus = statusFilter ? m.employmentStatus === statusFilter : true;
    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const handleEditSubmit = async () => {
    try {
      setSaving(true);
      const updated = await updateAdminUser(selectedMember.id, {
        department: selectedMember.department,
        designation: selectedMember.designation,
        reportingManager: selectedMember.reportingManager,
        officeLocation: selectedMember.officeLocation,
        role: selectedMember.role,
        employmentStatus: selectedMember.employmentStatus,
      });
      setTeamMembers(teamMembers.map(m => m.id === updated.id ? updated : m));
      setShowEditModal(false);
      setSelectedMember(null);
      notify("Team member updated successfully.");
    } catch (err) {
      console.error(err);
      alert(describeApiError(err, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setSaving(true);
      const updated = await updateAdminUser(selectedMember.id, { employmentStatus: "Inactive" });
      setTeamMembers(teamMembers.map(m => m.id === updated.id ? updated : m));
      setShowDeactivateModal(false);
      setShowViewModal(false);
      setSelectedMember(null);
      notify("Team member deactivated.");
    } catch (err) {
      console.error(err);
      alert(describeApiError(err, "Couldn't deactivate this account."));
    } finally {
      setSaving(false);
    }
  };

  const initials = (name) => (name || "").split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();

  return (
    <div className="admin-team-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-primary border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body"><i className="bi bi-info-circle me-2"></i>{toastMsg}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="fw-bold mb-1" style={{ color: "var(--crm-dark)", fontSize: "22px" }}>Team Management</h3>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Employees appear here automatically once they sign up or sign in — edit their department, role, or status below.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* SUMMARY CARDS */}
      <div className="row g-2">
        {[
          { title: "Total Team Members", value: teamMembers.length, icon: "bi-people", color: "#2563eb", bg: "#dbeafe" },
          { title: "Departments", value: uniqueDepartments.length, icon: "bi-diagram-3", color: "#8b5cf6", bg: "#ede9fe" },
          { title: "Admins", value: adminCount, icon: "bi-person-badge", color: "#f59e0b", bg: "#fef3c7" },
          { title: "Active Employees", value: activeEmployees, icon: "bi-person-check", color: "#10b981", bg: "#d1fae5" }
        ].map((stat, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px" }}>
              <div className="card-body p-2 d-flex align-items-center gap-2">
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  <i className={stat.icon}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>{stat.title}</h6>
                  <h4 className="mb-0 fw-bold" style={{ color: "var(--crm-dark)", fontSize: "20px" }}>{loading ? "—" : stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* LEFT COLUMN: Department Panel */}
        <div className="col-12 col-xl-2">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
              <h6 className="fw-bold mb-0 text-muted text-uppercase" style={{ fontSize: "11px" }}>Departments</h6>
            </div>
            <div className="card-body px-2 pb-3 pt-1 d-flex flex-column gap-1">
              <button className={`btn w-100 text-start px-2 py-1 ${deptFilter === "" ? "btn-primary" : "btn-light bg-transparent"}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setDeptFilter("")}>
                <i className="bi bi-grid-fill me-2"></i> All Departments
              </button>
              {uniqueDepartments.map(dept => (
                <button key={dept} className={`btn w-100 text-start px-2 py-1 ${deptFilter === dept ? "btn-primary" : "btn-light bg-transparent"}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setDeptFilter(dept)}>
                  <i className="bi bi-folder-fill me-2 text-muted"></i> {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Table */}
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-header bg-white border-bottom py-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="position-relative" style={{ minWidth: "200px" }}>
                  <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: "10px", fontSize: "13px" }}></i>
                  <input type="text" className="form-control ps-4" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "6px", fontSize: "13px", height: "34px" }} />
                </div>
                <select className="form-select w-auto" style={{ borderRadius: "6px", fontSize: "13px", height: "34px" }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
                <select className="form-select w-auto" style={{ borderRadius: "6px", fontSize: "13px", height: "34px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button className="btn btn-primary px-3" style={{ borderRadius: "6px", fontSize: "13px", height: "34px", padding: "0 12px" }} onClick={() => setShowAddModal(true)}>
                <i className="bi bi-person-plus me-1"></i> Add Member
              </button>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5 text-muted">Loading team...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3"><i className="bi bi-people text-muted" style={{ fontSize: "36px" }}></i></div>
                  <h5 className="fw-bold text-dark mb-1">No Team Members Found</h5>
                  <p className="text-muted mb-0">No one matches these filters yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ verticalAlign: "middle" }}>
                    <thead className="table-light">
                      <tr>
                        <th className="px-3 py-2 text-muted fw-semibold text-uppercase" style={{ fontSize: "11px" }}>Employee</th>
                        <th className="py-2 text-muted fw-semibold text-uppercase" style={{ fontSize: "11px" }}>ID</th>
                        <th className="py-2 text-muted fw-semibold text-uppercase" style={{ fontSize: "11px" }}>Role & Dept</th>
                        <th className="py-2 text-muted fw-semibold text-uppercase" style={{ fontSize: "11px" }}>Manager</th>
                        <th className="py-2 text-muted fw-semibold text-uppercase" style={{ fontSize: "11px" }}>Status</th>
                        <th className="py-2 text-muted fw-semibold text-uppercase text-end px-3" style={{ fontSize: "11px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map(m => (
                        <tr key={m.id}>
                          <td className="px-3 py-2">
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#2563eb" }}>
                                {initials(m.fullName)}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{m.fullName}</div>
                                <div className="text-muted" style={{ fontSize: "12px" }}>{m.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 text-muted" style={{ fontSize: "13px" }}>{m.employeeId || "—"}</td>
                          <td className="py-2">
                            <div className="fw-semibold text-dark text-capitalize" style={{ fontSize: "13px" }}>{m.role}</div>
                            <div className="text-muted" style={{ fontSize: "12px" }}>{m.designation || m.department || "—"}</div>
                          </td>
                          <td className="py-2 text-muted" style={{ fontSize: "13px" }}>{m.reportingManager || "N/A"}</td>
                          <td className="py-2">
                            <span className={`badge rounded-pill px-2 py-1 ${m.employmentStatus === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: "11px" }}>
                              {m.employmentStatus || "Active"}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-end">
                            <button className="btn btn-sm btn-light border me-1 p-1" style={{ fontSize: "12px" }} title="View" onClick={() => { setSelectedMember(m); setShowViewModal(true); }}><i className="bi bi-eye text-primary"></i></button>
                            <button className="btn btn-sm btn-light border p-1" style={{ fontSize: "12px" }} title="Edit" onClick={() => { setSelectedMember(m); setShowEditModal(true); }}><i className="bi bi-pencil"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MEMBER MODAL */}
      {showViewModal && selectedMember && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-0 pb-0 justify-content-end">
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800", color: "#fff", margin: "0 auto 16px" }}>
                    {initials(selectedMember.fullName)}
                  </div>
                  <h4 className="fw-bold mb-1">{selectedMember.fullName}</h4>
                  <p className="text-muted mb-2">{selectedMember.designation || "—"} &bull; {selectedMember.department || "—"}</p>
                  <span className={`badge rounded-pill ${selectedMember.employmentStatus === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'} mb-4 px-3`}>{selectedMember.employmentStatus || "Active"}</span>

                  <div className="text-start border p-3 rounded bg-light mb-3">
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Employee ID</span><span className="fw-semibold small">{selectedMember.employeeId || "—"}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Email</span><span className="fw-semibold small">{selectedMember.email}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Phone</span><span className="fw-semibold small">{selectedMember.phoneNumber || "—"}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Manager</span><span className="fw-semibold small">{selectedMember.reportingManager || "N/A"}</span></div>
                    <div className="d-flex justify-content-between"><span className="text-muted small">Joined</span><span className="fw-semibold small">{selectedMember.createdAt ? new Date(selectedMember.createdAt).toLocaleDateString() : "—"}</span></div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-danger" onClick={() => setShowDeactivateModal(true)} disabled={selectedMember.employmentStatus !== 'Active'}>
                    {selectedMember.employmentStatus === 'Active' ? 'Deactivate' : 'Already Inactive'}
                  </button>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light border" onClick={() => setShowViewModal(false)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => { setShowViewModal(false); setShowEditModal(true); }}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditModal && selectedMember && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">Edit Team Member</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Department</label>
                      <input type="text" className="form-control" value={selectedMember.department || ""} onChange={e => setSelectedMember({...selectedMember, department: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Designation</label>
                      <input type="text" className="form-control" value={selectedMember.designation || ""} onChange={e => setSelectedMember({...selectedMember, designation: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Office Location</label>
                      <input type="text" className="form-control" value={selectedMember.officeLocation || ""} onChange={e => setSelectedMember({...selectedMember, officeLocation: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Reporting Manager</label>
                      <input type="text" className="form-control" value={selectedMember.reportingManager || ""} onChange={e => setSelectedMember({...selectedMember, reportingManager: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Role</label>
                      <select className="form-select" value={selectedMember.role} onChange={e => setSelectedMember({...selectedMember, role: e.target.value})}>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Status</label>
                      <select className="form-select" value={selectedMember.employmentStatus || "Active"} onChange={e => setSelectedMember({...selectedMember, employmentStatus: e.target.value})}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light border" onClick={() => setShowEditModal(false)} disabled={saving}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleEditSubmit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DEACTIVATE CONFIRMATION MODAL */}
      {showDeactivateModal && selectedMember && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Deactivate Team Member</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeactivateModal(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0 text-muted">
                    Are you sure you want to deactivate <strong>{selectedMember.fullName}</strong>?
                    Their account stays on file but is marked Inactive — this doesn't delete their data.
                  </p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowDeactivateModal(false)} disabled={saving}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeactivate} disabled={saving}>{saving ? "Working..." : "Deactivate"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">Add Team Member</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    This creates a real, login-capable account. A temporary password is generated —
                    you'll see it once after creating the account, to share with the new hire.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">First Name</label>
                      <input type="text" className="form-control" value={newMember.firstName} onChange={e => setNewMember({...newMember, firstName: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Last Name</label>
                      <input type="text" className="form-control" value={newMember.lastName} onChange={e => setNewMember({...newMember, lastName: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Email</label>
                      <input type="email" className="form-control" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Phone</label>
                      <input type="text" className="form-control" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Employee ID</label>
                      <input type="text" className="form-control" value={newMember.employeeId} onChange={e => setNewMember({...newMember, employeeId: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Department</label>
                      <input type="text" className="form-control" value={newMember.department} onChange={e => setNewMember({...newMember, department: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Designation</label>
                      <input type="text" className="form-control" value={newMember.designation} onChange={e => setNewMember({...newMember, designation: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Reporting Manager</label>
                      <input type="text" className="form-control" value={newMember.manager} onChange={e => setNewMember({...newMember, manager: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Office Location</label>
                      <input type="text" className="form-control" value={newMember.officeLocation} onChange={e => setNewMember({...newMember, officeLocation: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Role</label>
                      <select className="form-select" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light border" onClick={() => setShowAddModal(false)} disabled={adding}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddMember} disabled={adding}>{adding ? "Creating..." : "Create Account"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ONE-TIME CREDENTIALS MODAL */}
      {createdCredentials && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-success"><i className="bi bi-check-circle me-2"></i>Account Created</h5>
                </div>
                <div className="modal-body py-4">
                  <p className="text-muted small">
                    Share these credentials with the new hire directly — this password won't be shown again.
                  </p>
                  <div className="bg-light border rounded p-3">
                    <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Email</span><span className="fw-semibold small">{createdCredentials.email}</span></div>
                    <div className="d-flex justify-content-between"><span className="text-muted small">Temporary Password</span><span className="fw-bold small font-monospace">{createdCredentials.tempPassword}</span></div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-primary w-100" onClick={() => { setCreatedCredentials(null); setShowAddModal(false); }}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// AdminTasks
// =========================
const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [newTask, setNewTask] = useState({
    targetType: "employee", title: "", description: "", employeeId: "", department: "", dueDate: "", priority: "Medium", category: "General"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [taskList, employeeList] = await Promise.all([adminGetAllTasks(), adminGetEmployees()]);
      setTasks(taskList);
      setEmployees(employeeList.filter(e => e.role === "employee"));
    } catch (err) {
      console.error(err);
      setError(describeApiError(err, "Couldn't load tasks."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribers = [
      onSocketEvent("task:new", () => loadData()),
      onSocketEvent("task:updated", () => loadData()),
      onSocketEvent("task:deleted", () => loadData()),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.assignedTo && t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const handleCreateSubmit = async () => {
    if (!newTask.title) {
      alert("Task title is required.");
      return;
    }
    if (newTask.targetType === "employee" && !newTask.employeeId) {
      alert("Please choose an employee to assign this task to.");
      return;
    }
    if (newTask.targetType === "department" && !newTask.department) {
      alert("Please choose a department to assign this task to.");
      return;
    }
    try {
      setSubmitting(true);
      const result = await adminAssignTask(newTask);
      await loadData();
      setShowCreateModal(false);
      setNewTask({ targetType: "employee", title: "", description: "", employeeId: "", department: "", dueDate: "", priority: "Medium", category: "General" });
      setToastMsg(result.count > 1 ? `Task assigned to ${result.count} employees.` : "Task assigned successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert(describeApiError(err, "Couldn't assign the task."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await adminDeleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Couldn't delete the task. Please try again.");
    }
  };

  return (
    <div className="admin-tasks-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-primary border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body"><i className="bi bi-info-circle me-2"></i>{toastMsg}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="fw-bold mb-1" style={{ color: "var(--crm-dark)" }}>Task Management</h2>
        <p className="text-muted">Assign, monitor, and manage employee tasks across departments.</p>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="position-relative" style={{ minWidth: "250px" }}>
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: "12px" }}></i>
              <input type="text" className="form-control ps-5" placeholder="Search tasks or assignees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "8px" }} />
            </div>
          </div>
          <button className="btn btn-primary px-3" style={{ borderRadius: "8px" }} onClick={() => setShowCreateModal(true)} disabled={loading}>
            <i className="bi bi-plus-lg me-2"></i>Assign Task
          </button>
        </div>
        <div className="card-body p-0">
          {error && <div className="alert alert-danger m-3">{error}</div>}
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ verticalAlign: "middle" }}>
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 text-muted small fw-semibold text-uppercase">Task</th>
                  <th className="py-3 text-muted small fw-semibold text-uppercase">Assignee</th>
                  <th className="py-3 text-muted small fw-semibold text-uppercase">Due Date</th>
                  <th className="py-3 text-muted small fw-semibold text-uppercase">Priority</th>
                  <th className="py-3 text-muted small fw-semibold text-uppercase">Status</th>
                  <th className="py-3 text-muted small fw-semibold text-uppercase text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Loading tasks...</td></tr>
                )}
                {!loading && filteredTasks.map(t => (
                  <tr key={t.id}>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">{t.title}</div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--crm-hover)", color: "var(--crm-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11.5px", fontWeight: "bold" }}>
                          {t.assignedTo ? t.assignedTo[0] : "U"}
                        </div>
                        <span className="text-dark">{t.assignedTo || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{t.dueDate || "—"}</td>
                    <td className="py-3">
                      <span className={`badge bg-light border ${t.priority === 'High' ? 'text-danger' : t.priority === 'Medium' ? 'text-warning' : 'text-info'}`}>
                        {t.priority || "Medium"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill ${t.status === 'Completed' ? 'bg-success bg-opacity-10 text-success' : t.status === 'In Progress' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <button className="btn btn-sm btn-light border text-danger" title="Delete" onClick={() => handleDelete(t.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">Assign New Task</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Task Title</label>
                      <input type="text" className="form-control" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Update Employee Handbook" />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Description</label>
                      <textarea className="form-control" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Assign To</label>
                      <div className="btn-group w-100 mb-2" role="group">
                        {[
                          { key: "employee", label: "Specific Employee" },
                          { key: "department", label: "Whole Department" },
                          { key: "all", label: "Everyone" },
                        ].map(opt => (
                          <button
                            key={opt.key}
                            type="button"
                            className={`btn btn-sm ${newTask.targetType === opt.key ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setNewTask({ ...newTask, targetType: opt.key, employeeId: "", department: "" })}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {newTask.targetType === "employee" && (
                        <select className="form-select" value={newTask.employeeId} onChange={e => setNewTask({...newTask, employeeId: e.target.value})}>
                          <option value="">Select an employee...</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                          ))}
                        </select>
                      )}
                      {newTask.targetType === "department" && (
                        <select className="form-select" value={newTask.department} onChange={e => setNewTask({...newTask, department: e.target.value})}>
                          <option value="">Select a department...</option>
                          {departments.map(dep => (
                            <option key={dep} value={dep}>{dep}</option>
                          ))}
                        </select>
                      )}
                      {newTask.targetType === "all" && (
                        <div className="alert alert-info py-2 px-3 mb-0 small">This task will be assigned to every employee ({employees.length} total).</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Category</label>
                      <select className="form-select" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                        <option>General</option><option>HR</option><option>Sales</option><option>Engineering</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Due Date</label>
                      <input type="date" className="form-control" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Priority</label>
                      <select className="form-select" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light border" onClick={() => setShowCreateModal(false)} disabled={submitting}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleCreateSubmit} disabled={submitting}>
                    {submitting ? "Assigning..." : "Assign Task"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// AdminDocuments
// =========================
const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [pendingFile, setPendingFile] = useState(null);
  const [newDoc, setNewDoc] = useState({
    name: "", category: "General", department: "All", visibility: "Everyone", description: "", tags: ""
  });

  const categories = [
    "HR Policies", "Company Forms", "Employee Handbook", "Training Materials",
    "Legal Documents", "Finance", "Marketing", "Engineering", "Sales", "General"
  ];

  const loadDocs = async () => {
    try {
      setLoading(true);
      setError("");
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
      setError(describeApiError(err, "Couldn't load documents."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
    const unsubscribers = [
      onSocketEvent("document:new", () => loadDocs()),
      onSocketEvent("document:deleted", () => loadDocs()),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const notify = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isRecent = (d) => d.createdAt && new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = documents.filter(isRecent).length;
  const sharedCount = documents.filter(d => d.visibility === 'Everyone').length;

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? d.department === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setNewDoc(prev => ({ ...prev, name: prev.name || file.name }));
  };

  const handleUploadSubmit = async () => {
    if (!pendingFile) {
      notify("Please choose a file to upload.");
      return;
    }
    if (!newDoc.name) {
      notify("Document title is required.");
      return;
    }
    try {
      setUploading(true);
      const fileUrl = await fileToDataUrl(pendingFile);
      const extension = "." + (pendingFile.name.split(".").pop() || "").toLowerCase();
      await createDocument({
        name: newDoc.name,
        fileUrl,
        extension,
        category: newDoc.category,
        department: newDoc.department,
        size: formatFileSize(pendingFile.size),
        visibility: newDoc.visibility,
        description: newDoc.description,
        tags: newDoc.tags,
      });
      await loadDocs();
      setShowUploadModal(false);
      setNewDoc({ name: "", category: "General", department: "All", visibility: "Everyone", description: "", tags: "" });
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      notify("Document uploaded successfully.");
    } catch (err) {
      console.error(err);
      alert(describeApiError(err, "Couldn't upload the document."));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(selectedDoc.id);
      setDocuments(documents.filter(d => d.id !== selectedDoc.id));
      setShowDeleteModal(false);
      setShowViewModal(false);
      setSelectedDoc(null);
      notify("Document deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Couldn't delete the document. Please try again.");
    }
  };

  const getFileIcon = (ext) => {
    switch (ext) {
      case '.pdf': return <i className="bi bi-file-earmark-pdf text-danger fs-3"></i>;
      case '.xlsx': case '.xls': return <i className="bi bi-file-earmark-excel text-success fs-3"></i>;
      case '.docx': case '.doc': return <i className="bi bi-file-earmark-word text-primary fs-3"></i>;
      default: return <i className="bi bi-file-earmark-text text-muted fs-3"></i>;
    }
  };

  return (
    <div className="admin-documents-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-primary border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body"><i className="bi bi-info-circle me-2"></i>{toastMsg}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="fw-bold mb-1" style={{ color: "var(--crm-dark)" }}>Documents Management</h2>
        <p className="text-muted">Manage company documents, policies, forms, manuals, and department files.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* SUMMARY CARDS */}
      <div className="row g-3">
        {[
          { title: "Total Documents", value: documents.length, icon: "bi-files" },
          { title: "Recently Uploaded", value: recentCount, icon: "bi-cloud-arrow-up" },
          { title: "Shared Documents", value: sharedCount, icon: "bi-share" }
        ].map((stat, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-4">
            <div className="card bg-white h-100" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div className="card-body p-3 d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary" style={{ fontSize: "13px", fontWeight: "500" }}>{stat.title}</span>
                  <i className={`bi ${stat.icon} text-secondary`}></i>
                </div>
                <h3 className="mb-0 fw-semibold text-dark" style={{ fontSize: "24px" }}>{loading ? "—" : stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOP TOOLBAR & TABLE */}
      <div className="d-flex flex-wrap align-items-center gap-3">
        <div className="position-relative flex-grow-1" style={{ minWidth: "200px" }}>
          <i className="bi bi-search position-absolute top-50 translate-middle-y text-secondary" style={{ left: "12px", fontSize: "14px" }}></i>
          <input type="text" className="form-control ps-5" placeholder="Search Documents" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }} />
        </div>
        <select className="form-select w-auto" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        
        <button className="btn btn-primary ms-auto" style={{ borderRadius: "6px", fontSize: "14px", height: "38px", padding: "0 16px", backgroundColor: "#0d6efd", border: "none" }} onClick={() => setShowUploadModal(true)} disabled={loading}>
          Upload Document
        </button>
      </div>

      <div className="card bg-white" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-secondary">Loading documents...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3"><i className="bi bi-file-earmark text-secondary" style={{ fontSize: "24px" }}></i></div>
              <h6 className="fw-semibold text-dark mb-1">No Documents Found</h6>
              <p className="text-secondary" style={{ fontSize: "14px" }}>No documents have been uploaded yet. Click 'Upload Document' to add your first document.</p>
              <button className="btn btn-primary mt-2" style={{ borderRadius: "6px", fontSize: "14px", padding: "8px 16px", border: "none" }} onClick={() => setShowUploadModal(true)}>Upload Document</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0" style={{ verticalAlign: "middle", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th className="px-4 py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Document Name</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Category & Dept</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Uploaded By</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Date & Size</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Visibility</th>
                    <th className="py-3 px-4 text-secondary fw-semibold text-end border-bottom" style={{ fontSize: "13px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(d => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td className="px-4 py-3 fw-medium text-dark">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark text-secondary"></i>
                          <span style={{ cursor: "pointer" }} onClick={() => { setSelectedDoc(d); setShowViewModal(true); }}>{d.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="fw-medium text-dark">{d.category}</div>
                        <div className="text-secondary" style={{ fontSize: "13px" }}>{d.department || "All"}</div>
                      </td>
                      <td className="py-3 text-secondary">{d.uploadedByName || "—"}</td>
                      <td className="py-3 text-secondary">
                        <div className="fw-medium text-dark">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}</div>
                        <div className="text-secondary" style={{ fontSize: "13px" }}>{d.size}</div>
                      </td>
                      <td className="py-3 text-secondary">{d.visibility}</td>
                      <td className="py-3 px-4 text-end">
                        <button className="btn btn-sm btn-link text-secondary p-0 me-3 text-decoration-none" title="View" onClick={() => { setSelectedDoc(d); setShowViewModal(true); }}>View</button>
                        <a className="btn btn-sm btn-link text-secondary p-0 me-3 text-decoration-none" title="Download" href={d.fileUrl} download={d.name}>Download</a>
                        <button className="btn btn-sm btn-link text-danger p-0 text-decoration-none" title="Delete" onClick={() => { setSelectedDoc(d); setShowDeleteModal(true); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">Upload Document</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <div
                        className="border border-dashed rounded p-4 text-center bg-light"
                        style={{ cursor: "pointer" }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input type="file" ref={fileInputRef} className="d-none" onChange={handleFilePick} />
                        <i className="bi bi-cloud-arrow-up text-primary" style={{ fontSize: "28px" }}></i>
                        <p className="fw-semibold mb-1 mt-2">{pendingFile ? pendingFile.name : "Click to choose a file"}</p>
                        <p className="text-muted small mb-0">{pendingFile ? formatFileSize(pendingFile.size) : "PDF, Word, Excel, or any file type"}</p>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Document Title</label>
                      <input type="text" className="form-control" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} placeholder="e.g. Q3 Sales Report" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Category</label>
                      <select className="form-select" value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Department</label>
                      <select className="form-select" value={newDoc.department} onChange={e => setNewDoc({...newDoc, department: e.target.value})}>
                        <option>All</option><option>HR</option><option>Sales</option><option>Engineering</option><option>Marketing</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Visibility</label>
                      <select className="form-select" value={newDoc.visibility} onChange={e => setNewDoc({...newDoc, visibility: e.target.value})}>
                        <option>Everyone</option>
                        <option>Specific Department</option>
                        <option>Admins Only</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Description (optional)</label>
                      <textarea className="form-control" rows="2" value={newDoc.description} onChange={e => setNewDoc({...newDoc, description: e.target.value})} placeholder="Brief description of the document..."></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Tags (optional)</label>
                      <input type="text" className="form-control" value={newDoc.tags} onChange={e => setNewDoc({...newDoc, tags: e.target.value})} placeholder="e.g. policies, 2026, onboarding" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light border" onClick={() => setShowUploadModal(false)} disabled={uploading}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleUploadSubmit} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedDoc && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-bold">{selectedDoc.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Category</span><span className="fw-semibold small">{selectedDoc.category}</span></div>
                  <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Department</span><span className="fw-semibold small">{selectedDoc.department || "All"}</span></div>
                  <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Uploaded By</span><span className="fw-semibold small">{selectedDoc.uploadedByName || "—"}</span></div>
                  <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Size</span><span className="fw-semibold small">{selectedDoc.size}</span></div>
                  <div className="d-flex justify-content-between"><span className="text-muted small">Visibility</span><span className="fw-semibold small">{selectedDoc.visibility}</span></div>
                </div>
                <div className="modal-footer border-top py-3 px-4 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
                  <div className="d-flex gap-2">
                    <a className="btn btn-primary" href={selectedDoc.fileUrl} download={selectedDoc.name}>Download</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedDoc && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", border: "none" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Delete Document</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0 text-muted">Are you sure you want to permanently delete <strong>{selectedDoc.name}</strong>?</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// AdminNotifications
// =========================
// =========================
// =========================
const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [filter, setFilter] = useState("Pending");

  const load = () => {
    getAllLeaveRequests()
      .then((data) => setLeaveRequests(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    connectSocket();
    const unsub = onSocketEvent("leave:new", load);
    return unsub;
  }, []);

  const handleAction = async (id, status) => {
    setActioningId(id);
    try {
      await updateLeaveRequestStatus(id, status);
      load();
    } catch (err) {
      alert(describeApiError ? describeApiError(err) : "Couldn't update this request — please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const visible = leaveRequests.filter((r) => filter === "All" || r.status === filter);
  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;

  return (
    <div className="card bg-white mb-2" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-semibold mb-0 text-dark" style={{ fontSize: "16px" }}>
              Leave Requests {pendingCount > 0 && <span className="badge bg-danger ms-1">{pendingCount} pending</span>}
            </h5>
            <p className="text-secondary mb-0" style={{ fontSize: "13px" }}>Requests employees have sent for approval.</p>
          </div>
          <select className="form-select form-select-sm w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="All">All</option>
          </select>
        </div>

        {loading ? (
          <div className="text-secondary text-center py-3" style={{ fontSize: "13px" }}>Loading leave requests...</div>
        ) : visible.length === 0 ? (
          <div className="text-secondary text-center py-3" style={{ fontSize: "13px" }}>No {filter !== "All" ? filter.toLowerCase() : ""} leave requests.</div>
        ) : (
          <div className="table-responsive">
            <table className="table mb-0" style={{ fontSize: "13.5px" }}>
              <thead>
                <tr>
                  <th className="text-secondary fw-semibold border-bottom">Employee</th>
                  <th className="text-secondary fw-semibold border-bottom">Type</th>
                  <th className="text-secondary fw-semibold border-bottom">Dates</th>
                  <th className="text-secondary fw-semibold border-bottom">Reason</th>
                  <th className="text-secondary fw-semibold border-bottom">Status</th>
                  <th className="text-secondary fw-semibold border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-medium text-dark">{r.employeeName}</td>
                    <td>{r.type}</td>
                    <td>{r.startDate} → {r.endDate} <span className="text-secondary">({r.days}d)</span></td>
                    <td className="text-secondary">{r.reason || "—"}</td>
                    <td>
                      <span className={`badge ${r.status === "Approved" ? "bg-success" : r.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {r.status === "Pending" ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            disabled={actioningId === r.id}
                            onClick={() => handleAction(r.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={actioningId === r.id}
                            onClick={() => handleAction(r.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-secondary">{r.reviewedByName ? `by ${r.reviewedByName}` : "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminNotifications = () => {
  const { notifications, setNotifications } = useCRMContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [newNotif, setNewNotif] = useState({
    title: "", message: "", recipientType: "All Employees", department: "",
    employee: "", category: "General Announcement", priority: "Medium", status: "Active", schedule: "Send Now", date: "", time: "", attachment: null
  });

  const totalNotifs = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const scheduledCount = notifications.filter(n => n.status === "Scheduled").length;
  const sentCount = notifications.filter(n => n.status === "Sent" || !n.status).length;

  const filteredNotifs = notifications.filter(n => {
    return n.text?.toLowerCase().includes(searchTerm.toLowerCase()) || n.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateSubmit = () => {
    if (!newNotif.title || !newNotif.message) {
      setToastMsg("Title and Message are required.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    const created = {
      id: Date.now(),
      title: newNotif.title,
      text: newNotif.message,
      time: newNotif.schedule === "Send Now" ? "Just now" : "Scheduled",
      icon: "bi-bell",
      color: "text-dark",
      isRead: false,
      recipient: newNotif.recipientType,
      department: newNotif.department || "All",
      priority: newNotif.priority,
      category: newNotif.category,
      status: newNotif.schedule === "Send Now" ? "Sent" : "Scheduled",
      createdDate: new Date().toLocaleDateString('en-US')
    };
    setNotifications([created, ...notifications]);
    setShowCreateModal(false);
    setNewNotif({ title: "", message: "", recipientType: "All Employees", department: "", employee: "", category: "General Announcement", priority: "Medium", status: "Active", schedule: "Send Now", date: "", time: "", attachment: null });
    setToastMsg("Notification created successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = () => {
    setNotifications(notifications.filter(n => n.id !== selectedNotif.id));
    setShowDeleteModal(false);
    setShowViewModal(false);
    setSelectedNotif(null);
    setToastMsg("Notification deleted successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="admin-notifications-container" style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#333" }}>

      <AdminLeaveRequests />

      {/* Toast */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center bg-white border shadow-sm" role="alert">
            <div className="d-flex">
              <div className="toast-body text-dark"><i className="bi bi-info-circle me-2"></i>{toastMsg}</div>
              <button type="button" className="btn-close me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-semibold mb-1 text-dark" style={{ fontSize: "24px" }}>Notification Management</h2>
          <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>Create, manage and distribute company notifications to employees.</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3">
        {[
          { title: "Total Notifications", value: totalNotifs, icon: "bi-bell" },
          { title: "Unread Notifications", value: unreadCount, icon: "bi-envelope" },
          { title: "Scheduled", value: scheduledCount, icon: "bi-clock" },
          { title: "Sent Notifications", value: sentCount, icon: "bi-send" }
        ].map((stat, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-3">
            <div className="card bg-white h-100" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div className="card-body p-3 d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary" style={{ fontSize: "13px", fontWeight: "500" }}>{stat.title}</span>
                  <i className={`bi ${stat.icon} text-secondary`}></i>
                </div>
                <h3 className="mb-0 fw-semibold text-dark" style={{ fontSize: "24px" }}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS & TOOLBAR */}
      <div className="d-flex flex-wrap align-items-center gap-3">
        <div className="position-relative flex-grow-1" style={{ minWidth: "200px" }}>
          <i className="bi bi-search position-absolute top-50 translate-middle-y text-secondary" style={{ left: "12px", fontSize: "14px" }}></i>
          <input type="text" className="form-control ps-5" placeholder="Search Notifications" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }} />
        </div>
        <select className="form-select w-auto" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }}>
          <option value="">Recipient</option>
          <option value="All">All Employees</option>
          <option value="Department">Department</option>
        </select>
        <select className="form-select w-auto" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }}>
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select className="form-select w-auto" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }}>
          <option value="">Status</option>
          <option value="Sent">Sent</option>
          <option value="Scheduled">Scheduled</option>
        </select>
        <input type="date" className="form-control w-auto text-secondary" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", height: "38px" }} />
        
        <button className="btn btn-primary ms-auto" style={{ borderRadius: "6px", fontSize: "14px", height: "38px", padding: "0 16px", backgroundColor: "#0d6efd", border: "none" }} onClick={() => setShowCreateModal(true)}>
          Create Notification
        </button>
      </div>

      {/* TABLE */}
      <div className="card bg-white" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div className="card-body p-0">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3"><i className="bi bi-bell text-secondary" style={{ fontSize: "24px" }}></i></div>
              <h6 className="fw-semibold text-dark mb-1">No Notifications Found</h6>
              <p className="text-secondary" style={{ fontSize: "14px" }}>No notifications have been created yet. Click 'Create Notification' to add your first notification.</p>
              <button className="btn btn-primary mt-2" style={{ borderRadius: "6px", fontSize: "14px", padding: "8px 16px", border: "none" }} onClick={() => setShowCreateModal(true)}>Create Notification</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0" style={{ verticalAlign: "middle", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th className="px-4 py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Title</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Recipient</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Category</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Priority</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Status</th>
                    <th className="py-3 text-secondary fw-semibold border-bottom" style={{ fontSize: "13px" }}>Created Date</th>
                    <th className="py-3 px-4 text-secondary fw-semibold text-end border-bottom" style={{ fontSize: "13px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifs.map(n => (
                    <tr key={n.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td className="px-4 py-3 fw-medium text-dark">{n.title || n.text}</td>
                      <td className="py-3 text-secondary">{n.recipient || "All Employees"}</td>
                      <td className="py-3 text-secondary">{n.category || n.type || "General"}</td>
                      <td className="py-3 text-secondary">{n.priority || "Medium"}</td>
                      <td className="py-3 text-secondary">{n.status || "Sent"}</td>
                      <td className="py-3 text-secondary">{n.createdDate || "Today"}</td>
                      <td className="py-3 px-4 text-end">
                        <button className="btn btn-sm btn-link text-secondary p-0 me-3 text-decoration-none" title="View" onClick={() => { setSelectedNotif(n); setShowViewModal(true); }}>View</button>
                        <button className="btn btn-sm btn-link text-secondary p-0 me-3 text-decoration-none" title="Edit" onClick={() => { setSelectedNotif(n); setShowEditModal(true); }}>Edit</button>
                        <button className="btn btn-sm btn-link text-danger p-0 text-decoration-none" title="Delete" onClick={() => { setSelectedNotif(n); setShowDeleteModal(true); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NOTIFICATION MODAL */}
      {showCreateModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-semibold text-dark" style={{ fontSize: "16px" }}>Create Notification</h5>
                  <button type="button" className="btn-close" style={{ fontSize: "12px" }} onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Title</label>
                      <input type="text" className="form-control" value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Message</label>
                      <textarea className="form-control" rows="3" value={newNotif.message} onChange={e => setNewNotif({...newNotif, message: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Recipient</label>
                      <select className="form-select" value={newNotif.recipientType} onChange={e => setNewNotif({...newNotif, recipientType: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <option>All Employees</option>
                        <option>Department</option>
                        <option>Individual Employee</option>
                      </select>
                    </div>
                    {newNotif.recipientType === "Department" && (
                      <div className="col-md-6">
                        <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Department (optional)</label>
                        <select className="form-select" value={newNotif.department} onChange={e => setNewNotif({...newNotif, department: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                          <option value="">Select Department</option>
                          <option>HR</option><option>Sales</option><option>Engineering</option>
                        </select>
                      </div>
                    )}
                    {newNotif.recipientType === "Individual Employee" && (
                      <div className="col-md-6">
                        <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Employee</label>
                        <input type="text" className="form-control" placeholder="Search employee..." value={newNotif.employee} onChange={e => setNewNotif({...newNotif, employee: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Category</label>
                      <select className="form-select" value={newNotif.category} onChange={e => setNewNotif({...newNotif, category: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <option>General Announcement</option>
                        <option>Meeting Reminder</option>
                        <option>Emergency Alert</option>
                        <option>System Update</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Priority</label>
                      <select className="form-select" value={newNotif.priority} onChange={e => setNewNotif({...newNotif, priority: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Status</label>
                      <select className="form-select" value={newNotif.status} onChange={e => setNewNotif({...newNotif, status: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <option>Active</option><option>Draft</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Send Now / Schedule</label>
                      <select className="form-select" value={newNotif.schedule} onChange={e => setNewNotif({...newNotif, schedule: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <option>Send Now</option>
                        <option>Schedule for Later</option>
                      </select>
                    </div>
                    {newNotif.schedule === "Schedule for Later" && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Date</label>
                          <input type="date" className="form-control" value={newNotif.date} onChange={e => setNewNotif({...newNotif, date: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Time</label>
                          <input type="time" className="form-control" value={newNotif.time} onChange={e => setNewNotif({...newNotif, time: e.target.value})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                        </div>
                      </>
                    )}
                    <div className="col-12">
                      <label className="form-label text-dark fw-medium" style={{ fontSize: "14px" }}>Attachment (optional)</label>
                      <input type="file" className="form-control" onChange={e => setNewNotif({...newNotif, attachment: e.target.files[0]})} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", fontWeight: "500" }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" style={{ borderRadius: "6px", fontSize: "14px", fontWeight: "500", backgroundColor: "#0d6efd", border: "none" }} onClick={handleCreateSubmit}>Publish</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedNotif && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <div className="modal-header border-bottom py-3 px-4">
                  <h5 className="modal-title fw-semibold text-dark" style={{ fontSize: "16px" }}>Notification Details</h5>
                  <button type="button" className="btn-close" style={{ fontSize: "12px" }} onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <h5 className="fw-semibold mb-2 text-dark" style={{ fontSize: "16px" }}>{selectedNotif.title || "Notification"}</h5>
                  <p className="text-secondary mb-4" style={{ fontSize: "14px" }}>{selectedNotif.text}</p>
                  <div className="row g-3" style={{ fontSize: "14px" }}>
                    <div className="col-6">
                      <span className="text-secondary d-block">Recipient</span>
                      <span className="fw-medium text-dark">{selectedNotif.recipient || "All Employees"}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Department</span>
                      <span className="fw-medium text-dark">{selectedNotif.department || "All"}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Priority</span>
                      <span className="fw-medium text-dark">{selectedNotif.priority || "Medium"}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Category</span>
                      <span className="fw-medium text-dark">{selectedNotif.category || selectedNotif.type || "General"}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Created Date</span>
                      <span className="fw-medium text-dark">{selectedNotif.createdDate || "Today"}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Status</span>
                      <span className="fw-medium text-dark">{selectedNotif.status || "Sent"}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-3 px-4">
                  <button type="button" className="btn btn-light" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", fontWeight: "500" }} onClick={() => setShowViewModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedNotif && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-semibold text-danger" style={{ fontSize: "16px" }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Notification</h5>
                  <button type="button" className="btn-close" style={{ fontSize: "12px" }} onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0 text-secondary" style={{ fontSize: "14px" }}>Are you sure you want to permanently delete this notification?</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" style={{ borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", fontWeight: "500" }} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" style={{ borderRadius: "6px", fontSize: "14px", fontWeight: "500" }} onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// AdminSettings
// =========================
const AdminSettings = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    website: "",
    timeZone: "",
    currency: "",
    workingHours: "",
    companyDescription: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("primary");

  useEffect(() => {
    let isMounted = true;
    getCompanySettings()
      .then(data => {
        if (isMounted && data) {
          setFormData(prev => ({ ...prev, ...data }));
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setToastMsg("Couldn't load company settings.");
          setToastType("danger");
          setShowToast(true);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanySettings(formData);
      setToastMsg("Company settings saved successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMsg(describeApiError(err, "Failed to save settings."));
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card-flat" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {showToast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px",
          background: toastType === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px",
          borderRadius: "8px", fontWeight: "750", zIndex: 1300,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "8px"
        }}>
          <i className={`bi ${toastType === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i> {toastMsg}
        </div>
      )}

      <div className="card-flat-title-bar">
        <h3><i className="bi bi-buildings"></i> Company Settings</h3>
        <span className="text-muted" style={{ fontSize: "11.5px", fontWeight: "700" }}>Manage your organization's core details and preferences.</span>
      </div>

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5 gap-3">
          <div style={{ width: "20px", height: "20px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span className="text-muted" style={{ fontSize: "12px" }}>Loading settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="row g-4">
            <div className="col-12">
              <div className="p-3 border rounded-3 bg-light">
                <h4 className="mb-3" style={{ fontSize: "13px", fontWeight: "800", color: "var(--crm-primary)" }}>Basic Information</h4>
                <div className="row g-3">
                  <div className="col-md-6 modal-form-group">
                    <label>Company Name <span className="text-danger">*</span></label>
                    <input type="text" name="companyName" className="form-control" value={formData.companyName || ""} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 modal-form-group">
                    <label>Company Logo URL</label>
                    <input type="text" name="companyLogo" className="form-control" value={formData.companyLogo || ""} onChange={handleChange} placeholder="https://example.com/logo.png" />
                  </div>
                  <div className="col-md-6 modal-form-group">
                    <label>Company Email <span className="text-danger">*</span></label>
                    <input type="email" name="companyEmail" className="form-control" value={formData.companyEmail || ""} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 modal-form-group">
                    <label>Company Phone</label>
                    <input type="text" name="companyPhone" className="form-control" value={formData.companyPhone || ""} onChange={handleChange} />
                  </div>
                  <div className="col-12 modal-form-group">
                    <label>Company Address</label>
                    <input type="text" name="companyAddress" className="form-control" value={formData.companyAddress || ""} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="p-3 border rounded-3 bg-light">
                <h4 className="mb-3" style={{ fontSize: "13px", fontWeight: "800", color: "var(--crm-primary)" }}>Preferences & Additional Details</h4>
                <div className="row g-3">
                  <div className="col-md-6 modal-form-group">
                    <label>Website URL</label>
                    <input type="url" name="website" className="form-control" value={formData.website || ""} onChange={handleChange} placeholder="https://" />
                  </div>
                  <div className="col-md-3 modal-form-group">
                    <label>Time Zone</label>
                    <input type="text" name="timeZone" className="form-control" value={formData.timeZone || ""} onChange={handleChange} placeholder="e.g. GMT+5:30" />
                  </div>
                  <div className="col-md-3 modal-form-group">
                    <label>Currency</label>
                    <input type="text" name="currency" className="form-control" value={formData.currency || ""} onChange={handleChange} placeholder="e.g. USD" />
                  </div>
                  <div className="col-md-6 modal-form-group">
                    <label>Working Hours</label>
                    <input type="text" name="workingHours" className="form-control" value={formData.workingHours || ""} onChange={handleChange} placeholder="e.g. 9 AM - 6 PM" />
                  </div>
                  <div className="col-12 modal-form-group">
                    <label>Company Description</label>
                    <textarea name="companyDescription" className="form-control" rows="3" value={formData.companyDescription || ""} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4 text-end">
              <button type="submit" className="btn btn-primary px-4 py-2" style={{ fontWeight: "700", borderRadius: "8px" }} disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : <i className="bi bi-save-fill me-2"></i>}
                Save Settings
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// =========================
// AdminNews
// =========================
const AdminNews = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("primary");
  
  const [newNews, setNewNews] = useState({
    title: "", content: "", category: "Announcement"
  });

  const fetchAnnouncements = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const data = await getNews();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      setError(describeApiError(err, "Failed to load announcements."));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(true);
    const unsubscribers = [
      onSocketEvent("news:new", () => fetchAnnouncements(false)),
      onSocketEvent("news:deleted", () => fetchAnnouncements(false)),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const handleCreateSubmit = async () => {
    if (!newNews.title || !newNews.content) {
      alert("Title and content are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createNews({
        title: newNews.title,
        content: newNews.content,
        type: newNews.category
      });
      setShowCreateModal(false);
      setNewNews({ title: "", content: "", category: "Announcement" });
      setToastMsg("News published successfully.");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      fetchAnnouncements(false);
    } catch (err) {
      alert(describeApiError(err, "Failed to publish news."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
      try {
        await deleteNews(id);
        fetchAnnouncements(false);
      } catch (err) {
        alert(describeApiError(err, "Failed to delete news post."));
      }
    }
  };

  return (
    <div className="dashboard-card-flat" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {showToast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px",
          background: toastType === "success" ? "#10b981" : "#ef4444",
          color: "white", padding: "12px 24px", borderRadius: "8px",
          fontWeight: "750", zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <i className={`bi ${toastType === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
          {toastMsg}
        </div>
      )}

      <div className="card-flat-title-bar d-flex justify-content-between align-items-center">
        <div>
          <h3 className="mb-1"><i className="bi bi-newspaper"></i> Company News</h3>
          <span className="text-muted" style={{ fontSize: "11.5px", fontWeight: "700" }}>Manage announcements, newsletters, and company updates.</span>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" style={{ fontWeight: "700", padding: "8px 16px", borderRadius: "8px" }} onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-megaphone-fill"></i> Publish News
        </button>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center py-5 gap-3">
          <div style={{ width: "20px", height: "20px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span className="text-muted" style={{ fontSize: "12px" }}>Loading announcements...</span>
        </div>
      )}

      {!loading && (error || announcements.length === 0) && (
        <div className="empty-state-card py-5 text-center">
          <i className="bi bi-newspaper empty-state-icon text-muted mb-3" style={{ fontSize: "44px", color: "#cbd5e1" }}></i>
          <h4 style={{ fontSize: "13px", fontWeight: "800", color: "var(--crm-dark)", margin: "0 0 6px" }}>No News Available</h4>
          <p className="text-muted mb-0" style={{ fontSize: "12px", maxWidth: "400px", margin: "0 auto" }}>There are currently no company announcements or news articles. Publish your first news update to keep employees informed.</p>
          
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div className="d-flex flex-column gap-3 mt-4">
          {announcements.map((news) => (
            <div
              key={news._id}
              style={{
                background: "#ffffff",
                border: "1px solid #eef0f6",
                borderRadius: "14px",
                padding: "20px 22px",
                boxShadow: "0 1px 5px rgba(15,23,42,0.05)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800" }}>
                    {(news.author && news.author.name) ? news.author.name[0] : "A"}
                  </div>
                  <div>
                    <h5 style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                      {news.title || news.content.substring(0, 30) + "..."}
                    </h5>
                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", display: "flex", gap: "10px", alignItems: "center" }}>
                      <span><i className="bi bi-person-fill me-1"></i>{news.author?.name || "Admin"}</span>
                      <span>•</span>
                      <span><i className="bi bi-clock-fill me-1"></i>{new Date(news.createdAt).toLocaleString()}</span>
                      {news.type && (
                        <>
                          <span>•</span>
                          <span style={{ padding: "3px 8px", background: "#f1f5f9", borderRadius: "4px", fontSize: "10px", fontWeight: "700", color: "#475569" }}>{news.type}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-light border text-danger"
                  style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                  onClick={() => handleDelete(news._id)}
                  title="Delete Announcement"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <p style={{ fontSize: "12.5px", color: "#334155", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {news.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "0", maxWidth: "600px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a" }}><i className="bi bi-megaphone-fill text-primary me-2"></i>Publish Company News</h5>
              <button type="button" style={{ background: "transparent", border: "none", fontSize: "18px", color: "#94a3b8", cursor: "pointer" }} onClick={() => setShowCreateModal(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div style={{ padding: "28px" }}>
              <div className="mb-3">
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>Headline / Title</label>
                <input type="text" className="form-control" style={{ fontSize: "12px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} placeholder="e.g. Q3 Financial Results Released" />
              </div>
              <div className="mb-3">
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>Category</label>
                <select className="form-select" style={{ fontSize: "12px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value})}>
                  <option>Announcement</option>
                  <option>Newsletter</option>
                  <option>Event</option>
                  <option>Policy Update</option>
                </select>
              </div>
              <div className="mb-3">
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>Content</label>
                <textarea className="form-control" rows="5" style={{ fontSize: "12px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} placeholder="Enter news content here..."></textarea>
              </div>
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px", background: "#f8fafc" }}>
              <button type="button" className="btn-profile-secondary" style={{ padding: "9px 20px", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "700" }} onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>Cancel</button>
              <button type="button" style={{ padding: "9px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }} onClick={handleCreateSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useCRMContext();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarActive, setMobileSidebarActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const renderActiveAdminMenu = () => {
    switch (activeMenu) {
      case "dashboard":
        return <AdminHome setActiveMenu={setActiveMenu} />;

      case "me":
        return <AdminProfile />;

      case "team":
        return <AdminTeam />;

      case "news":
        return <AdminNews />;

      case "calendar":
        return <AdminCalendar />;

      case "tasks":
        return <AdminTasks />;

      case "chat":
        return <ChatPage />;

      case "documents":
        return <AdminDocuments />;

      case "notifications":
        return <AdminNotifications />;

      case "settings":
        return <AdminSettings />;

      case "orgchart":
        return <AdminOrganizationChart />;

      default:
        return <AdminHome setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <div
      className={`crm-dashboard-layout ${
        sidebarCollapsed ? "collapsed-sidebar" : ""
      } ${mobileSidebarActive ? "mobile-sidebar-active" : ""}`}
    >
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
        setMobileActive={setMobileSidebarActive}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isAdmin={true}
      />

      {mobileSidebarActive && (
        <div
          className="crm-mobile-overlay"
          onClick={() => setMobileSidebarActive(false)}
        />
      )}

        <header className="crm-top-navbar">
          <div
            className="brand-section"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              className="nav-hamburger-btn"
              style={{
                background: "transparent",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--crm-dark)",
                transition: "all .25s ease",
              }}
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                setMobileSidebarActive(!mobileSidebarActive);
              }}
            >
              <i
                className={`bi ${
                  sidebarCollapsed ? "bi-list" : "bi-x-lg"
                } d-none d-md-inline-block`}
                style={{ fontSize: "20px" }}
              />

              <i
                className={`bi ${
                  mobileSidebarActive ? "bi-x-lg" : "bi-list"
                } d-inline-block d-md-none`}
                style={{ fontSize: "20px" }}
              />
            </button>
          </div>

          <GlobalSearch scope="admin" onNavigate={(path) => setActiveMenu(path)} />

          <div
            className="nav-right-controls"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              ref={profileRef}
              className="profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                className="avatar-circle"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--crm-hover)",
                  color: "var(--crm-primary)",
                  overflow: "hidden",
                  fontWeight: "700",
                }}
              >
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  profile?.firstName?.[0] ||
                  user?.fullName?.[0] ||
                  "AD"
                )}
              </div>

                          <div
                className="profile-name-text d-none d-lg-block"
                style={{
                  fontSize: "12.5px",
                  fontWeight: "700",
                  color: "var(--crm-dark)",
                }}
              >
                {profile?.displayName ||
                  user?.fullName ||
                  "Administrator"}
              </div>

              <i
                className="bi bi-chevron-down d-none d-sm-inline-block"
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              ></i>

              {showProfileMenu && (
                <div
                  className="controls-dropdown-panel profile"
                  style={{
                    position: "absolute",
                    top: "52px",
                    right: 0,
                    width: "230px",
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                    padding: "16px",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      fontSize: "11.5px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Account Options
                  </div>

                  <button
                    className="dropdown-row-link"
                    onClick={() => {
                      setActiveMenu("me");
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </button>

                  <button
                    className="dropdown-row-link"
                    onClick={() => {
                      setActiveMenu("settings");
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </button>

                  <hr />

                  <button
                    className="dropdown-row-link text-danger"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="crm-viewport-content">
          {/* FLUID ALIGNMENT */}
         <div
  style={{
    width: "100%",
    boxSizing: "border-box",
  }}
>
            {renderActiveAdminMenu()}
          </div>
        </main>
    </div>
  );
};

export default AdminDashboard;
