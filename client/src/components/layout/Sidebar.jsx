import React from 'react';

const Sidebar = ({ activeMenu, setActiveMenu, onLogout, setMobileActive, isAdmin = false }) => {
  const employeeMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { key: "me", label: "Me", icon: "bi-person" },
    { key: "news", label: "News", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", icon: "bi-check2-square" },
    { key: "team", label: "Team", icon: "bi-people" },
    { key: "documents", label: "Documents", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", icon: "bi-bell" },
    { key: "settings", label: "Settings", icon: "bi-gear" }
  ];

  const adminMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { key: "me", label: "My Profile", icon: "bi-person-badge" },
    { key: "team", label: "Employees", icon: "bi-people" },
    { key: "news", label: "News", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", icon: "bi-check2-square" },
    { key: "documents", label: "Documents", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", icon: "bi-bell" },
    { key: "settings", label: "Company Settings", icon: "bi-gear" }
  ];

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  return (
    <aside className="crm-sidebar-menu">
      <ul className="sidebar-links-stack">
        {menuItems.map(item => (
          <li className={activeMenu === item.key ? "active" : ""} key={item.key}>
            <button
              title={item.label}
              onClick={() => { setActiveMenu(item.key); setMobileActive(false); }}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-nav-label">{item.label}</span>
            </button>
          </li>
        ))}
        <li className="sidebar-logout-item">
          <button title="Logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span className="sidebar-nav-label">Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
