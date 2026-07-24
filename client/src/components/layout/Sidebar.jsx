import React from 'react';
import { useNavigate } from 'react-router-dom';
import useChatUnreadCount from '../../hooks/useChatUnreadCount';
import useNotificationUnreadCount from '../../hooks/useNotificationUnreadCount';
import useContactQueryUnreadCount from '../../hooks/useContactQueryUnreadCount';

const Sidebar = ({ activeMenu, setActiveMenu, onLogout, setMobileActive, isAdmin = false }) => {
  const navigate = useNavigate();
  const chatUnread = useChatUnreadCount();
  const notifUnread = useNotificationUnreadCount();
  const queriesUnread = useContactQueryUnreadCount();

  const employeeMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { key: "me", label: "Me", icon: "bi-person" },
    { key: "news", label: "News", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", icon: "bi-check2-square" },
    { key: "team", label: "Team", icon: "bi-people" },
  
    { key: "chat", label: "Chat", icon: "bi-chat-dots", to: "/chat" },
    { key: "documents", label: "Documents", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", icon: "bi-bell" },
    { key: "settings", label: "Settings", icon: "bi-gear" },
    { key: "orgchart", label: "Organization Chart", icon: "bi-diagram-3" }
  ];

  const adminMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { key: "me", label: "My Profile", icon: "bi-person-badge" },
    { key: "team", label: "Team", icon: "bi-people" },
    { key: "news", label: "News", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", icon: "bi-check2-square" },
    { key: "chat", label: "Chat", icon: "bi-chat-dots", to: "/chat" },
    { key: "contact-queries", label: "Customer Queries", icon: "bi-envelope-paper" },
    { key: "documents", label: "Documents", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", icon: "bi-bell" },
    { key: "settings", label: "Company Settings", icon: "bi-gear" },
    { key: "orgchart", label: "Organization Chart", icon: "bi-diagram-3" }
  ];

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  const handleItemClick = (item) => {
    setMobileActive(false);
    
    // Explicitly ensure Chat always renders inside the dashboard layout
    // bypassing any potential legacy 'to' properties
    if (item.key === "chat") {
      setActiveMenu(item.key);
      return;
    }
    
    if (item.to) {
      navigate(item.to);
    } else {
      setActiveMenu(item.key);
    }
  };

  return (
    <aside className="crm-sidebar-menu">
      <ul className="sidebar-links-stack">
        {menuItems.map(item => (
          <li className={activeMenu === item.key ? "active" : ""} key={item.key}>
            <button
              title={item.label}
              onClick={() => handleItemClick(item)}
              style={{ position: "relative" }}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-nav-label">{item.label}</span>
              {item.key === "chat" && chatUnread > 0 && (
                <span
                  className="badge rounded-pill bg-danger"
                  style={{ position: "absolute", top: "4px", right: "10px", fontSize: "10px" }}
                >
                  {chatUnread > 99 ? "99+" : chatUnread}
                </span>
              )}
              {item.key === "notifications" && notifUnread > 0 && (
                <span
                  className="badge rounded-pill bg-danger"
                  style={{ position: "absolute", top: "4px", right: "10px", fontSize: "10px" }}
                >
                  {notifUnread > 99 ? "99+" : notifUnread}
                </span>
              )}
              {item.key === "contact-queries" && queriesUnread > 0 && (
                <span
                  className="badge rounded-pill bg-danger"
                  style={{ position: "absolute", top: "4px", right: "10px", fontSize: "10px" }}
                >
                  {queriesUnread > 99 ? "99+" : queriesUnread}
                </span>
              )}
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
