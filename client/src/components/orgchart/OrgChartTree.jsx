import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users, ZoomIn, ZoomOut, Maximize, RotateCcw, Download, Eye, Search, FilterX, ChevronDown, ChevronUp } from "lucide-react";
import { getOrgChart } from "../../services/orgChartService";
import { connectSocket, onSocketEvent } from "../../services/socketService";
import "./OrgChartTree.css";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const flatten = (nodes, acc = []) => {
  nodes.forEach((n) => {
    acc.push(n);
    if (n.children?.length) flatten(n.children, acc);
  });
  return acc;
};

const OrgChartTree = ({ isAdmin }) => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set());

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [titleFilter, setTitleFilter] = useState("All");
  
  // UI Controls
  const [orientation, setOrientation] = useState("Top"); // "Top" | "Left" | "Right" | "Bottom"
  const [zoom, setZoom] = useState(1);

  const load = useCallback(async () => {
    try {
      const data = await getOrgChart();
      setTree(data.tree || []);
      setError("");
    } catch (err) {
      console.error("Failed to load organization chart:", err);
      setError("Couldn't load the organization chart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    connectSocket();
    const unsub = onSocketEvent("orgchart:updated", () => load());
    return unsub;
  }, [load]);

  const allNodes = useMemo(() => flatten(tree), [tree]);
  const totalEmployees = allNodes.length;
  
  // Note: the backend data might not have 'location' right now, but we prepare the dropdown for it.
  const locations = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.location).filter(Boolean))).sort(),
    [allNodes]
  );
  const departments = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.department).filter(Boolean))).sort(),
    [allNodes]
  );
  const titles = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.title).filter(Boolean))).sort(),
    [allNodes]
  );

  const hasActiveFilter = search.trim() !== "" || deptFilter !== "All" || titleFilter !== "All" || locationFilter !== "All";
  
  const matchesFilter = (node) => {
    const q = search.trim().toLowerCase();
    if (q && !node.name?.toLowerCase().includes(q)) return false;
    if (deptFilter !== "All" && node.department !== deptFilter) return false;
    if (titleFilter !== "All" && node.title !== titleFilter) return false;
    if (locationFilter !== "All" && node.location !== locationFilter) return false;
    return true;
  };

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("All");
    setDeptFilter("All");
    setTitleFilter("All");
  };

  const toggleCollapse = (nodeId, e) => {
    e.stopPropagation();
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(1);

  // Derive styles for orientation
  const getCanvasTransform = () => {
    switch (orientation) {
      case "Bottom": return "rotate(180deg)";
      case "Left": return "rotate(-90deg)";
      case "Right": return "rotate(90deg)";
      case "Top":
      default: return "rotate(0deg)";
    }
  };

  const getNodeTransform = () => {
    switch (orientation) {
      case "Bottom": return "rotate(-180deg)";
      case "Left": return "rotate(90deg)";
      case "Right": return "rotate(-90deg)";
      case "Top":
      default: return "rotate(0deg)";
    }
  };

  const renderNode = (node) => {
    const dim = hasActiveFilter && !matchesFilter(node);
    const hasChildren = node.children?.length > 0;
    const isCollapsed = collapsed.has(node.id);
    const nodeTransform = getNodeTransform();

    return (
      <li key={node.id}>
        <div 
          className={`org-card-container ${dim ? "dimmed" : ""}`} 
          style={{ transform: nodeTransform }}
        >
          <div className="org-card shadow-sm">
            <div className="org-card-content">
              <div className="org-avatar">
                {node.avatarUrl ? (
                  <img src={node.avatarUrl} alt={node.name} />
                ) : (
                  <span>{initials(node.name)}</span>
                )}
              </div>
              <div className="org-details">
                <div className="org-name">{node.name}</div>
                <div className="org-title">{node.title || "No Title"}</div>
                {node.department && <div className="org-dept">{node.department}</div>}
              </div>
            </div>
            {hasChildren && (
              <button 
                className="org-expand-btn" 
                onClick={(e) => toggleCollapse(node.id, e)}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            )}
          </div>
        </div>
        {hasChildren && !isCollapsed && (
          <ul>{node.children.map((child) => renderNode(child))}</ul>
        )}
      </li>
    );
  };

  return (
    <div className="d-flex flex-column gap-3 w-100 h-100">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1 text-dark" style={{ fontSize: "22px" }}>Organization Chart</h3>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            View your company's organizational hierarchy.
          </p>
        </div>
        <div className="card border-0 shadow-sm" style={{ borderRadius: "10px", minWidth: "160px" }}>
          <div className="card-body p-3 d-flex align-items-center gap-3">
            <div className="rounded bg-light text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
              <Users size={20} />
            </div>
            <div>
              <p className="text-muted mb-0" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Employees</p>
              <h5 className="fw-bold mb-0 text-dark">{totalEmployees}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3" style={{ alignItems: "stretch", minHeight: "600px", height: "calc(100vh - 200px)" }}>
        
        {/* LEFT FILTER PANEL */}
        <div className="card shadow-sm border-0 org-sidebar flex-shrink-0" style={{ width: "260px", borderRadius: "10px", backgroundColor: "#fff" }}>
          <div className="card-body p-4 d-flex flex-column gap-4">
            
            <div className="org-filter-group">
              <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: "12px" }}>Search by Name</label>
              <div className="position-relative">
                <Search size={14} className="position-absolute text-muted" style={{ top: "10px", left: "12px" }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a name..."
                  style={{ fontSize: "13px", height: "36px", paddingLeft: "32px" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="org-filter-group">
              <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: "12px" }}>Location</label>
              <select
                className="form-select"
                style={{ fontSize: "13px", height: "36px" }}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="All">All</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="org-filter-group">
              <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: "12px" }}>Department</label>
              <select
                className="form-select"
                style={{ fontSize: "13px", height: "36px" }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="org-filter-group">
              <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: "12px" }}>Job Role</label>
              <select
                className="form-select"
                style={{ fontSize: "13px", height: "36px" }}
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              >
                <option value="All">All</option>
                {titles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="org-filter-group">
              <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: "12px" }}>Orientation</label>
              <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {["Top", "Left", "Right", "Bottom"].map(dir => (
                  <button 
                    key={dir}
                    className={`btn btn-sm ${orientation === dir ? 'btn-brand' : 'btn-outline-secondary'}`}
                    style={{ fontSize: "12px", padding: "6px 0" }}
                    onClick={() => setOrientation(dir)}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-sm btn-light w-100 text-muted d-flex align-items-center justify-content-center gap-2"
                onClick={clearFilters}
              >
                <FilterX size={14} /> Clear Filters
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                <Eye size={14} /> Preview PDF
              </button>
              <button type="button" className="btn btn-sm btn-brand w-100 d-flex align-items-center justify-content-center gap-2">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CHART AREA */}
        <div className="card shadow-sm flex-grow-1 position-relative border-0" style={{ borderRadius: "10px", backgroundColor: "#f8fafc", overflow: "hidden" }}>
          
          {loading ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Loading organization chart...
            </div>
          ) : error ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-danger">
              {error}
            </div>
          ) : tree.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center text-center h-100">
              <span style={{ fontSize: "48px", marginBottom: "16px" }}>📊</span>
              <h4 className="fw-bold mb-2 text-dark">Organization Chart</h4>
              <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
                No organization data available.<br/>
                The organization chart will appear here once employees and reporting structures are added.
              </p>
            </div>
          ) : (
            <div className="org-canvas-wrapper" style={{ overflow: "auto", width: "100%", height: "100%" }}>
              <div 
                className="org-canvas" 
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: "center top",
                  padding: "40px",
                  minWidth: "max-content",
                  minHeight: "max-content",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <div style={{ transform: getCanvasTransform(), transformOrigin: "center center", transition: "transform 0.4s ease" }}>
                  <div className="org-tree">
                    <ul>
                      {tree.map((root) => renderNode(root))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ZOOM CONTROLS */}
          {tree.length > 0 && (
            <div className="position-absolute d-flex flex-column gap-1 bg-white shadow-sm p-1" style={{ bottom: "20px", right: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <button className="btn btn-sm btn-light text-muted p-2" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button className="btn btn-sm btn-light text-muted p-2" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <button className="btn btn-sm btn-light text-muted p-2" onClick={handleResetZoom} title="Reset View">
                <RotateCcw size={16} />
              </button>
              <button className="btn btn-sm btn-light text-muted p-2" onClick={handleResetZoom} title="Fit Screen">
                <Maximize size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgChartTree;
