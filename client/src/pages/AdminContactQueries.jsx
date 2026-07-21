import React, { useState, useEffect, useCallback } from "react";
import { getContactQueries, replyToContactQuery, closeContactQuery } from "../services/contactService";
import { onSocketEvent } from "../services/socketService";

const statusColors = {
  new: "primary",
  assigned: "warning",
  replied: "success",
  closed: "secondary",
};

const AdminContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadQueries = useCallback(async () => {
    try {
      const data = await getContactQueries();
      setQueries(data || []);
    } catch (err) {
      console.error("Failed to load contact queries:", err);
    }
  }, []);

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  useEffect(() => {
    const unsub = onSocketEvent("contact:new-query", () => loadQueries());
    return unsub;
  }, [loadQueries]);

  const [emailWarning, setEmailWarning] = useState("");

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selected) return;
    setSending(true);
    setEmailWarning("");
    try {
      const updated = await replyToContactQuery(selected.id, replyText.trim());
      setQueries((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setSelected(updated);
      setReplyText("");
      if (updated.emailWarning) setEmailWarning(updated.emailWarning);
    } catch (err) {
      alert(err.response?.data?.message || "Could not send reply.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = async (id) => {
    try {
      const updated = await closeContactQuery(id);
      setQueries((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === "all" ? queries : queries.filter((q) => q.status === filter);

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 80px)" }}>
      {/* List */}
      <div className="border-end" style={{ width: "380px", overflowY: "auto" }}>
        <div className="p-3 border-bottom">
          <h6 className="fw-bold mb-2">Customer Queries</h6>
          <select
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {filtered.length === 0 && (
          <div className="p-4 text-center text-muted small">No queries here.</div>
        )}

        {filtered.map((q) => (
          <button
            key={q.id}
            onClick={() => {
              setSelected(q);
              setReplyText("");
            }}
            className={`w-100 text-start border-0 p-3 border-bottom ${
              selected?.id === q.id ? "bg-light" : "bg-white"
            }`}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="fw-medium">{q.name}</div>
              <span className={`badge bg-${statusColors[q.status] || "secondary"}`} style={{ fontSize: "10px" }}>
                {q.status}
              </span>
            </div>
            <div className="small text-muted">{q.email}</div>
            <div className="small text-truncate mt-1" style={{ maxWidth: "300px" }}>
              {q.message}
            </div>
          </button>
        ))}
      </div>

      {/* Detail / reply panel */}
      <div className="flex-fill d-flex flex-column">
        {selected ? (
          <>
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold">{selected.name}</div>
                  <div className="small text-muted">
                    {selected.email}
                    {selected.phone ? ` · ${selected.phone}` : ""}
                    {selected.company ? ` · ${selected.company}` : ""}
                  </div>
                </div>
                {selected.status !== "closed" && (
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleClose(selected.id)}>
                    Close query
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 flex-fill" style={{ overflowY: "auto" }}>
              <div className="mb-4">
                <div className="small fw-bold text-muted mb-1">CUSTOMER MESSAGE</div>
                <div className="p-3 bg-light rounded-3">{selected.message}</div>
              </div>

              {selected.reply && (
                <div className="mb-4">
                  <div className="small fw-bold text-muted mb-1">
                    YOUR REPLY {selected.repliedAt ? `· ${new Date(selected.repliedAt).toLocaleString()}` : ""}
                  </div>
                  <div className="p-3 bg-primary bg-opacity-10 rounded-3">{selected.reply}</div>
                </div>
              )}
            </div>

            {selected.status !== "closed" && (
              <form onSubmit={handleReply} className="p-3 border-top">
                {emailWarning && (
                  <div className="alert alert-warning py-2 small mb-2">{emailWarning}</div>
                )}
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="Write a reply — this gets emailed to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="submit" className="btn btn-brand" disabled={sending || !replyText.trim()}>
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-fill d-flex align-items-center justify-content-center text-muted">
            Select a query to view and reply
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactQueries;
