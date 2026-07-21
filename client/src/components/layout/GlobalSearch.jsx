import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ scope = "employee", onNavigate }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const employeeModules = [
    { key: "dashboard", label: "Dashboard", type: "Module", icon: "bi-speedometer2" },
    { key: "me", label: "Me", type: "Profile", icon: "bi-person" },
    { key: "news", label: "News", type: "Module", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", type: "Module", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", type: "Module", icon: "bi-check2-square" },
    { key: "team", label: "Team", type: "Module", icon: "bi-people" },
    { key: "chat", label: "Chat", type: "Module", icon: "bi-chat-dots", to: "/chat" },
    { key: "documents", label: "Documents", type: "Module", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", type: "Module", icon: "bi-bell" },
    { key: "settings", label: "Settings", type: "Module", icon: "bi-gear" },
    { key: "orgchart", label: "Organization Chart", type: "Module", icon: "bi-diagram-3" }
  ];

  const adminModules = [
    { key: "dashboard", label: "Dashboard", type: "Module", icon: "bi-speedometer2" },
    { key: "me", label: "My Profile", type: "Profile", icon: "bi-person-badge" },
    { key: "team", label: "Employees", type: "Module", icon: "bi-people" },
    { key: "news", label: "News", type: "Module", icon: "bi-newspaper" },
    { key: "calendar", label: "Calendar", type: "Module", icon: "bi-calendar-event" },
    { key: "tasks", label: "Tasks", type: "Module", icon: "bi-check2-square" },
    { key: "chat", label: "Chat", type: "Module", icon: "bi-chat-dots", to: "/chat" },
    { key: "documents", label: "Documents", type: "Module", icon: "bi-file-earmark-text" },
    { key: "notifications", label: "Notifications", type: "Module", icon: "bi-bell" },
    { key: "settings", label: "Company Settings", type: "Module", icon: "bi-gear" },
    { key: "orgchart", label: "Organization Chart", type: "Module", icon: "bi-diagram-3" }
  ];

  const availableModules = scope === 'admin' ? adminModules : employeeModules;

  const results = query 
    ? availableModules.filter(m => m.label.toLowerCase().includes(query.toLowerCase()) || m.type.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery("");
    if (item.to) {
      navigate(item.to);
    } else if (onNavigate) {
      onNavigate(item.key);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || !query) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  return (
    <div 
      ref={wrapperRef}
      className="global-search-container"
      style={{ 
        flex: 1,
        maxWidth: '650px',
        margin: '0 10px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        minWidth: '50px'
      }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <i 
          className="bi bi-search" 
          style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af',
            fontSize: '14px'
          }}
        ></i>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query) setIsOpen(true); }}
          placeholder="Search employees, teams, tasks, documents, notifications..."
          style={{
            width: '100%',
            height: '42px',
            padding: '0 16px 0 40px',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#ffffff',
            fontSize: '13.5px',
            color: 'var(--crm-dark)',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            transition: 'border-color 0.2s ease, width 0.2s ease',
            fontFamily: 'inherit',
            textOverflow: 'ellipsis'
          }}
        />

        {isOpen && query && (
          <div 
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '8px 0'
            }}
          >
            {results.length > 0 ? (
              results.slice(0, 8).map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelect(item)}
                    style={{
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#f8fafc' : 'transparent',
                      borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <i className={`bi ${item.icon}`} style={{ fontSize: '14px' }}></i>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.02em', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {item.type}
                      </div>
                      <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--crm-dark)' }}>
                        {item.label}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b' }}>
                <i className="bi bi-search" style={{ fontSize: '24px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--crm-dark)', marginBottom: '4px' }}>No results found</div>
                <div style={{ fontSize: '12.5px' }}>Try searching employees, teams, documents, tasks or organization chart.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
