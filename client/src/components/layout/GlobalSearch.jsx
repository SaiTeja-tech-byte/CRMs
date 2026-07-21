import React, { useState, useEffect, useRef } from 'react';

const GlobalSearch = ({ scope = "employee" }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Grouped placeholder results based on typical CRM global search
  const results = query ? [
    { type: 'Employees', title: 'HR Manager', icon: 'bi-person' },
    { type: 'Employees', title: 'HR Executive', icon: 'bi-person' },
    { type: 'Teams', title: 'HR Department', icon: 'bi-people' },
    { type: 'Documents', title: 'HR Policy.pdf', icon: 'bi-file-earmark-text' },
    { type: 'Tasks', title: 'HR Recruitment Task', icon: 'bi-check2-square' },
    { type: 'Organization Chart', title: 'Human Resources', icon: 'bi-diagram-3' },
    { type: 'Notifications', title: 'HR Meeting Reminder', icon: 'bi-bell' },
    { type: 'Calendar', title: 'HR Interview Schedule', icon: 'bi-calendar-event' },
  ] : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < results.length) {
      setIsOpen(false);
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
          onFocus={() => setIsOpen(true)}
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
            {results.slice(0, 8).map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => setIsOpen(false)}
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
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.02em', marginBottom: '2px' }}>
                      {item.type}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--crm-dark)' }}>
                      {item.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
