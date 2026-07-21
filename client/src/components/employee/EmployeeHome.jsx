import React from 'react';

const EmployeeHome = ({
  profile,
  employeeStats,
  workSummary,
  productivity,
  attendance,
  leaveData,
  leaveBalance,
  otherEvents
}) => {
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

        /* ── Mini Stat Cards (2x2 grid) ── */
        .ew-mini-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ew-mini-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 1px 5px rgba(15,23,42,0.05);
          border: 1px solid #eef0f6;
          padding: 13px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ew-mini-label {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .ew-mini-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
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

        /* ── Holiday Card ── */
        .ew-holiday-card {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .ew-circle-wrap {
          position: relative;
          width: 90px;
          height: 90px;
          flex-shrink: 0;
        }
        .ew-circle-bg {
          fill: none;
          stroke: #e2e8f0;
          stroke-width: 8;
        }
        .ew-circle-fill {
          fill: none;
          stroke: #2563eb;
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          transition: stroke-dashoffset 0.6s ease;
          transform: rotate(-90deg);
          transform-origin: center;
        }
        .ew-circle-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ew-circle-num {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .ew-circle-sub {
          font-size: 9px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .ew-holiday-info {
          flex: 1;
        }
        .ew-holiday-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .ew-holiday-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 14px;
        }
        .ew-holiday-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ew-holiday-stat-label {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .ew-holiday-stat-val {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }
        .ew-btn-primary {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ew-btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .ew-btn-primary:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        /* ── Events Card ── */
        .ew-events-card {
          padding: 20px 24px;
        }
        .ew-events-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .ew-events-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .ew-events-sub {
          font-size: 11px;
          color: #94a3b8;
          margin: 0 0 16px;
        }
        .ew-btn-outline {
          background: transparent;
          color: #2563eb;
          border: 1.5px solid #2563eb;
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ew-btn-outline:hover:not(:disabled) {
          background: #2563eb;
          color: #fff;
        }
        .ew-btn-outline:disabled {
          color: #cbd5e1;
          border-color: #e2e8f0;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .ew-root { flex-direction: column; }
          .ew-left { width: 100%; }
          .ew-summary-grid { grid-template-columns: repeat(2, 1fr); }
          .ew-progress-row, .ew-two-col { grid-template-columns: 1fr; }
          .ew-holiday-card { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="ew-root">

        <div className="ew-left">

          {/* Profile Card */}
          <div className="ew-card ew-profile-card">
            {/* Avatar */}
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" className="ew-avatar" style={{ display: "flex" }} />
            ) : (
              <div className="ew-avatar">
                {`${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}` || "U"}
              </div>
            )}

            <p className="ew-profile-name">
              {profile?.displayName || `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Employee Name"}
            </p>
            <p className="ew-profile-designation">{profile?.designation || "—"}</p>
            <p className="ew-profile-dept">{profile?.department || "—"}</p>

            <div className="ew-status-badge">
              <span className="ew-status-dot" />
              {profile?.employmentStatus || "Active"}
            </div>

            <div className="ew-divider" />

            <div className="ew-info-grid">
              {[
                { label: "Employee ID",       value: profile?.employeeId },
                { label: "Company",           value: profile?.company },
                { label: "Office Location",   value: profile?.officeLocation },
                { label: "Official Email",    value: profile?.officialEmail },
                { label: "Phone Number",      value: profile?.phoneNumber },
                { label: "Joining Date",      value: profile?.joiningDate },
                { label: "Reporting Manager", value: profile?.reportingManager },
                { label: "Employment Type",   value: profile?.employmentType },
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

          {/* 4 Mini Stat Cards */}
          <div className="ew-mini-stats">
            {[
              { label: "Leaves This Year", value: employeeStats?.leavesThisYear ?? 0 },
              { label: "Overdue Tasks",    value: employeeStats?.overdueTasks    ?? 0 },
              { label: "Overtime (hrs)",   value: employeeStats?.overtimeHours   ?? 0 },
              { label: "Projects",         value: employeeStats?.projects        ?? 0 },
            ].map(({ label, value }) => (
              <div className="ew-mini-card" key={label}>
                <span className="ew-mini-label">{label}</span>
                <span className="ew-mini-value">{value}</span>
              </div>
            ))}
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
                { label: "Today's Meetings",  value: workSummary?.todaysMeetings  ?? 0 },
                { label: "Pending Tasks",     value: workSummary?.pendingTasks    ?? 0 },
                { label: "Open Deals",        value: workSummary?.openDeals       ?? 0 },
                { label: "Upcoming Events",   value: workSummary?.upcomingEvents  ?? 0 },
                { label: "Recent Activity",   value: workSummary?.recentActivity  ?? 0 },
                { label: "Notifications",     value: workSummary?.notifications   ?? 0 },
              ].map(({ label, value }) => (
                <div className="ew-summary-item" key={label}>
                  <div className="ew-summary-item-label">{label}</div>
                  <div className="ew-summary-item-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ew-progress-row">
            <div className="ew-card ew-progress-card">
              <p className="ew-progress-title">Productivity</p>
              <p className="ew-progress-sub">Weekly performance score</p>
              <div className="ew-progress-bar-wrap">
                <div
                  className="ew-progress-bar-fill"
                  style={{ width: `${productivity?.weeklyPercent ?? 0}%`, background: "#2563eb" }}
                />
              </div>
              <span className="ew-progress-pct">{productivity?.weeklyPercent ?? 0}%</span>
            </div>

            <div className="ew-card ew-progress-card">
              <p className="ew-progress-title">Attendance</p>
              <p className="ew-progress-sub">Monthly attendance rate</p>
              <div className="ew-progress-bar-wrap">
                <div
                  className="ew-progress-bar-fill"
                  style={{ width: `${attendance?.monthlyPercent ?? 0}%`, background: "#10b981" }}
                />
              </div>
              <span className="ew-progress-pct">{attendance?.monthlyPercent ?? 0}%</span>
            </div>
          </div>

          <div className="ew-two-col">
            <div className="ew-card ew-leave-card">
              <h4 className="ew-leave-title">Team Members On Leave</h4>
              {(!leaveData?.teamOnLeave || leaveData.teamOnLeave.length === 0) ? (
                <div className="ew-empty-state">
                  <div className="ew-empty-icon"><i className="bi bi-people" /></div>
                  <span className="ew-empty-text">No employees on leave</span>
                </div>
              ) : (
                leaveData.teamOnLeave.map((m) => (
                  <div key={m.id} style={{ fontSize: "13px", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    {m.name} — <span style={{ color: "#94a3b8" }}>{m.type}</span>
                  </div>
                ))
              )}
            </div>

            <div className="ew-card ew-leave-card">
              <h4 className="ew-leave-title">Leave Requests</h4>
              {(!leaveData?.requests || leaveData.requests.length === 0) ? (
                <div className="ew-empty-state">
                  <div className="ew-empty-icon"><i className="bi bi-calendar-x" /></div>
                  <span className="ew-empty-text">No leave requests</span>
                </div>
              ) : (
                leaveData.requests.map((r) => (
                  <div key={r.id} style={{ fontSize: "13px", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    {r.type} — <span style={{ color: "#94a3b8" }}>{r.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="ew-card ew-holiday-card">
            {/* Circular progress */}
            <div className="ew-circle-wrap">
              <svg viewBox="0 0 90 90" width="90" height="90">
                <circle className="ew-circle-bg" cx="45" cy="45" r="35" />
                <circle
                  className="ew-circle-fill"
                  cx="45" cy="45" r="35"
                  style={{
                    strokeDashoffset: 220 - (220 * ((leaveBalance?.remainingLeave ?? 0) / Math.max(leaveBalance?.earnedLeave ?? 1, 1)))
                  }}
                />
              </svg>
              <div className="ew-circle-label">
                <span className="ew-circle-num">{leaveBalance?.remainingLeave ?? 0}</span>
                <span className="ew-circle-sub">Left</span>
              </div>
            </div>

            <div className="ew-holiday-info">
              <h4 className="ew-holiday-title">Holiday & Leave Balance</h4>
              <div className="ew-holiday-stats">
                <div className="ew-holiday-stat">
                  <span className="ew-holiday-stat-label">Remaining Leave</span>
                  <span className="ew-holiday-stat-val">{leaveBalance?.remainingLeave ?? 0}</span>
                </div>
                <div className="ew-holiday-stat">
                  <span className="ew-holiday-stat-label">Earned Leave</span>
                  <span className="ew-holiday-stat-val">{leaveBalance?.earnedLeave ?? 0}</span>
                </div>
              </div>
              <button className="ew-btn-primary" disabled>
                Request Leave
              </button>
            </div>
          </div>

          <div className="ew-card ew-events-card">
            <div className="ew-events-header">
              <h4 className="ew-events-title">Other Events</h4>
              <button className="ew-btn-outline" disabled>Request Event</button>
            </div>
            <p className="ew-events-sub">Track your additional leave types and custom events</p>
            {(!otherEvents || otherEvents.length === 0) && (
              <div className="ew-empty-state" style={{ paddingBottom: "16px" }}>
                <div className="ew-empty-icon"><i className="bi bi-calendar2-event" /></div>
                <span className="ew-empty-text">No upcoming events</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default EmployeeHome;
