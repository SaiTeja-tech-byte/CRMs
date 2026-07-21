import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users, ZoomIn, ZoomOut, Maximize, RotateCcw, Download, Eye, Search, FilterX, ChevronDown, ChevronUp, Pencil, Trash2, Plus, X } from "lucide-react";
import { getOrgChart, createOrgNode, updateOrgNode, deleteOrgNode } from "../../services/orgChartService";
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

const eligibleParents = (allNodes, excludeId) => {
  if (!excludeId) return allNodes;
  const blocked = new Set([excludeId]);
  let grew = true;
  while (grew) {
    grew = false;
    allNodes.forEach((n) => {
      if (n.parentId && blocked.has(n.parentId) && !blocked.has(n.id)) {
        blocked.add(n.id);
        grew = true;
      }
    });
  }
  return allNodes.filter((n) => !blocked.has(n.id));
};

const emptyForm = { name: "", title: "", department: "", employeeId: "" };

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

  // Admin Management Forms
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [formValues, setFormValues] = useState(emptyForm);
  const [formParentId, setFormParentId] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

  // Admin form handlers
  const openAddForm = (parentId) => {
    setFormMode("add");
    setFormParentId(parentId || null);
    setEditingNode(null);
    setFormValues(emptyForm);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (node) => {
    setFormMode("edit");
    setEditingNode(node);
    setFormParentId(node.parentId || null);
    setFormValues({
      name: node.name || "",
      title: node.title || "",
      department: node.department || "",
      employeeId: node.employeeId || "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormError("");
  };

  const handleFormChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.name.trim() || !formValues.title.trim() || !formValues.department.trim()) {
      setFormError("Employee Name, Designation, and Department are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (formMode === "add") {
        await createOrgNode({ ...formValues, parentId: formParentId });
      } else {
        await updateOrgNode(editingNode.id, { ...formValues, parentId: formParentId });
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (node) => {
    const childCount = node.children?.length || 0;
    const warning = childCount
      ? `Remove ${node.name} from the chart? Their ${childCount} direct report${childCount > 1 ? "s" : ""} will move up to report to ${node.parentId ? "their manager" : "the top of the chart"}.`
      : `Remove ${node.name} from the chart?`;
    if (!window.confirm(warning)) return;
    try {
      await deleteOrgNode(node.id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't remove this from the chart.");
    }
  };

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
            {isAdmin && (
              <div className="org-card-actions">
                <button type="button" className="org-card-action-btn" title="Edit Employee" onClick={() => openEditForm(node)}>
                  <Pencil size={12} />
                </button>
                <button type="button" className="org-card-action-btn text-danger" title="Delete Employee" onClick={() => handleDelete(node)}>
                  <Trash2 size={12} />
                </button>
              </div>
            )}
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

            {isAdmin && (
              <button 
                className={`org-add-child-btn ${hasChildren ? "has-children" : ""}`} 
                onClick={() => openAddForm(node.id)}
                title="Add Team Member"
              >
                <Plus size={14} />
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
            {isAdmin ? "View and manage your company's organizational structure." : "View your company's organizational hierarchy."}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
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
          {isAdmin && (
            <button className="btn btn-brand d-flex align-items-center gap-1 shadow-sm" style={{ height: "64px" }} onClick={() => openAddForm(null)}>
              <Plus size={16} /> Add Position
            </button>
          )}
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
              {isAdmin && (
                <button className="btn btn-brand d-flex align-items-center gap-1 mt-2 shadow-sm" onClick={() => openAddForm(null)}>
                  <Plus size={16} /> Add Position
                </button>
              )}
            </div>
          ) : (
            <div className="org-canvas-wrapper" style={{ overflow: "auto", width: "100%", height: "100%" }}>
              <div 
                className="org-canvas" 
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: "center top",
                  padding: "60px",
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

      {/* ADMIN MODAL FORM */}
      {isAdmin && formOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
          onClick={closeForm}
        >
          <div className="bg-white rounded-4 p-4 shadow-lg" style={{ width: "500px", maxWidth: "95vw" }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h5 className="fw-bold m-0 text-dark">
                  {formMode === "add" ? "Add Team Member" : "Edit Employee"}
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  Add a new employee to the organization hierarchy.
                </p>
              </div>
              <button type="button" className="btn btn-sm btn-light p-1 text-muted" onClick={closeForm}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold mb-1">Employee Name *</label>
                <input type="text" name="name" className="form-control" style={{ borderRadius: "8px" }} value={formValues.name} onChange={handleFormChange} autoFocus />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold mb-1">Designation *</label>
                <input type="text" name="title" className="form-control" style={{ borderRadius: "8px" }} value={formValues.title} onChange={handleFormChange} />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold mb-1">Department *</label>
                <input type="text" name="department" className="form-control" style={{ borderRadius: "8px" }} value={formValues.department} onChange={handleFormChange} />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold mb-1">Employee ID (Optional)</label>
                <input type="text" name="employeeId" className="form-control" style={{ borderRadius: "8px" }} value={formValues.employeeId} onChange={handleFormChange} />
              </div>
              <div className="mb-4">
                <label className="form-label small text-muted fw-semibold mb-1">Reporting To *</label>
                <select
                  className="form-select"
                  style={{ borderRadius: "8px" }}
                  value={formParentId || ""}
                  onChange={(e) => setFormParentId(e.target.value || null)}
                >
                  <option value="">— Top of chart —</option>
                  {eligibleParents(allNodes, editingNode?.id).map((n) => (
                    <option key={n.id} value={n.id}>{n.name}{n.title ? ` (${n.title})` : ""}</option>
                  ))}
                </select>
              </div>

              {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

              <div className="d-flex gap-2 justify-content-end pt-3 mt-2 border-top">
                <button type="button" className="btn btn-light" style={{ borderRadius: "8px" }} onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-brand" style={{ borderRadius: "8px" }} disabled={saving}>
                  {saving ? "Saving..." : formMode === "add" ? "Add Employee" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgChartTree;
