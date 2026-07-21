import { useState, useEffect, useCallback, useMemo } from "react";
import { Users, Plus, Pencil, Trash2, X, Share2, ImagePlus } from "lucide-react";
import { getOrgChart, createOrgNode, updateOrgNode, deleteOrgNode } from "../../services/orgChartService";
import { connectSocket, onSocketEvent } from "../../services/socketService";
import "./OrgChartTree.css";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const LEVEL_COLORS = ["#e11d48", "#2563eb", "#ea580c", "#0d9488", "#7c3aed"];

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const tenureLabel = (createdAt) => {
  if (!createdAt) return "";
  const start = new Date(createdAt);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 1) return "< 1 Month";
  if (months < 12) return `${months} Month${months > 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths === 0
    ? `${years} Year${years > 1 ? "s" : ""}`
    : `${years} Yr${years > 1 ? "s" : ""} ${remMonths} Mo`;
};

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

const emptyForm = { name: "", title: "", department: "", email: "", phone: "", avatarUrl: "" };

const OrgChartTree = ({ isAdmin }) => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set());

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [titleFilter, setTitleFilter] = useState("All");

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
  const departments = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.department).filter(Boolean))).sort(),
    [allNodes]
  );
  const titles = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.title).filter(Boolean))).sort(),
    [allNodes]
  );

  const hasActiveFilter = search.trim() !== "" || deptFilter !== "All" || titleFilter !== "All";
  const matchesFilter = (node) => {
    const q = search.trim().toLowerCase();
    if (q && !node.name?.toLowerCase().includes(q)) return false;
    if (deptFilter !== "All" && node.department !== deptFilter) return false;
    if (titleFilter !== "All" && node.title !== titleFilter) return false;
    return true;
  };

  // ---- Admin form handlers ----
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
      email: node.email || "",
      phone: node.phone || "",
      avatarUrl: node.avatarUrl || "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormError("");
  };

  const [photoUploading, setPhotoUploading] = useState(false);

  const handleFormChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setFormError("Photo is too large — please use one under 3MB.");
      return;
    }
    setPhotoUploading(true);
    setFormError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      setFormValues((prev) => ({ ...prev, avatarUrl: dataUrl }));
    } catch (err) {
      setFormError("Couldn't read that photo — please try another.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const removePhoto = () => setFormValues((prev) => ({ ...prev, avatarUrl: "" }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.name.trim()) {
      setFormError("Name is required.");
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

  const toggleCollapse = (nodeId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const renderNode = (node, depth) => {
    const color = LEVEL_COLORS[depth % LEVEL_COLORS.length];
    const dim = hasActiveFilter && !matchesFilter(node);
    const hasChildren = node.children?.length > 0;
    const isCollapsed = collapsed.has(node.id);
    return (
      <li key={node.id}>
        <div className={`org-node ${dim ? "org-node-dim" : ""}`} style={{ "--org-accent": color }}>
          {isAdmin && (
            <div className="org-node-actions">
              <button type="button" className="org-node-btn" title="Edit" onClick={() => openEditForm(node)}>
                <Pencil size={12} />
              </button>
              <button type="button" className="org-node-btn danger" title="Remove" onClick={() => handleDelete(node)}>
                <Trash2 size={12} />
              </button>
            </div>
          )}
          <div className="org-node-row">
            <div className="org-node-avatar">
              {node.avatarUrl ? (
                <img src={node.avatarUrl} alt={node.name} className="org-node-avatar-img" />
              ) : (
                initials(node.name)
              )}
            </div>
            <div className="org-node-info">
              <div className="org-node-name">{node.name}</div>
              {node.title && <div className="org-node-title">{node.title}</div>}
              <div className="org-node-tenure">{tenureLabel(node.createdAt)}</div>
            </div>
          </div>
          {(node.department || node.phone || node.email) && (
            <div className="org-node-meta">
              {node.department && <div>{node.department}</div>}
              {node.phone && <div>{node.phone}</div>}
              {node.email && <div className="text-truncate">{node.email}</div>}
            </div>
          )}
          {isAdmin && (
            <div className="org-node-add">
              <button
                type="button"
                className="org-node-btn brand"
                title="Add a direct report"
                onClick={() => openAddForm(node.id)}
              >
                <Plus size={13} />
              </button>
            </div>
          )}
          {hasChildren && (
            <button
              type="button"
              className={`org-node-chevron ${isCollapsed ? "collapsed" : ""}`}
              title={isCollapsed ? "Expand direct reports" : "Collapse direct reports"}
              onClick={() => toggleCollapse(node.id)}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        {hasChildren && !isCollapsed && (
          <ul>{node.children.map((child) => renderNode(child, depth + 1))}</ul>
        )}
        {hasChildren && isCollapsed && (
          <div className="org-node-collapsed-hint">{node.children.length} hidden</div>
        )}
      </li>
    );
  };

  return (
    <div className="orgchart-container" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--crm-dark)", fontSize: "22px" }}>Organization Chart</h3>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            {isAdmin ? "View and manage your company's organizational structure." : "View your company's organizational structure."}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px", minWidth: "200px" }}>
            <div className="card-body p-3 d-flex align-items-center">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Total Employees</p>
                <h5 className="fw-bold mb-0">{totalEmployees}</h5>
              </div>
            </div>
          </div>
          {isAdmin && (
            <button className="btn btn-brand d-flex align-items-center gap-1" onClick={() => openAddForm(null)}>
              <Plus size={16} /> Add Position
            </button>
          )}
        </div>
      </div>

      <div className="d-flex gap-3" style={{ alignItems: "stretch", minHeight: "500px" }}>
        {/* LEFT FILTER PANEL */}
        <div className="card shadow-sm" style={{ width: "260px", minWidth: "260px", border: "1px solid #e2e8f0", borderRadius: "10px", backgroundColor: "#fff" }}>
          <div className="card-body p-3">
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Search by Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Type a name..."
                style={{ fontSize: "13px", height: "34px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Department</label>
              <select
                className="form-select"
                style={{ fontSize: "13px", height: "34px", padding: "4px 32px 4px 12px" }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "12px" }}>Job Role</label>
              <select
                className="form-select"
                style={{ fontSize: "13px", height: "34px", padding: "4px 32px 4px 12px" }}
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              >
                <option value="All">All</option>
                {titles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => { setSearch(""); setDeptFilter("All"); setTitleFilter("All"); }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card shadow-sm flex-grow-1" style={{ border: "1px solid #e2e8f0", borderRadius: "10px", backgroundColor: "#fff", overflow: "hidden" }}>
          {loading ? (
            <div className="card-body d-flex align-items-center justify-content-center text-muted h-100" style={{ minHeight: "500px" }}>
              Loading organization chart...
            </div>
          ) : error ? (
            <div className="card-body d-flex align-items-center justify-content-center text-muted h-100" style={{ minHeight: "500px" }}>
              {error}
            </div>
          ) : tree.length === 0 ? (
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center h-100" style={{ minHeight: "500px" }}>
              <Share2 size={48} className="text-muted mb-3" />
              <h4 className="fw-bold mb-2">Organization Chart Not Available</h4>
              <p className="text-muted" style={{ maxWidth: "400px" }}>
                {isAdmin
                  ? "Add the first position to start building your company's chart."
                  : "The organizational hierarchy will appear here once it has been configured."}
              </p>
              {isAdmin && (
                <button className="btn btn-brand d-flex align-items-center gap-1 mt-2" onClick={() => openAddForm(null)}>
                  <Plus size={16} /> Add Position
                </button>
              )}
            </div>
          ) : (
            <div className="org-tree-scroll">
              <ul className="org-tree">{tree.map((root) => renderNode(root, 0))}</ul>
            </div>
          )}
        </div>
      </div>

      {isAdmin && formOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
          onClick={closeForm}
        >
          <div className="bg-white rounded-3 p-4" style={{ width: "380px", maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold m-0">
                {formMode === "add" ? (formParentId ? "Add Direct Report" : "Add Position") : "Edit Position"}
              </h6>
              <button type="button" className="btn btn-sm btn-light p-1" onClick={closeForm}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "56px", height: "56px", background: "#f1f5f9", overflow: "hidden", fontWeight: 700, color: "#64748b" }}
                >
                  {formValues.avatarUrl ? (
                    <img src={formValues.avatarUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    initials(formValues.name)
                  )}
                </div>
                <div>
                  <label className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-0" style={{ cursor: "pointer" }}>
                    <ImagePlus size={14} />
                    {photoUploading ? "Uploading..." : "Upload Photo"}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoUploading} hidden />
                  </label>
                  {formValues.avatarUrl && (
                    <button type="button" className="btn btn-sm btn-link text-danger p-0 ms-2" onClick={removePhoto}>
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Name *</label>
                <input type="text" name="name" className="form-control" value={formValues.name} onChange={handleFormChange} autoFocus />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Job Title</label>
                <input type="text" name="title" className="form-control" placeholder="e.g. VP - Sales" value={formValues.title} onChange={handleFormChange} />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Department</label>
                <input type="text" name="department" className="form-control" value={formValues.department} onChange={handleFormChange} />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Phone</label>
                <input type="text" name="phone" className="form-control" value={formValues.phone} onChange={handleFormChange} />
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Email</label>
                <input type="email" name="email" className="form-control" value={formValues.email} onChange={handleFormChange} />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted mb-1">Reports To</label>
                <select
                  className="form-select"
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

              <div className="d-flex gap-2 justify-content-end mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-brand" disabled={saving}>
                  {saving ? "Saving..." : formMode === "add" ? "Add" : "Save Changes"}
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
