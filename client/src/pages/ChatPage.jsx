import { useState, useEffect, useRef, useCallback } from "react";
import { Send, UserPlus, Check, CheckCheck, X, MessageCircle, Smile, Paperclip, FileText, Pencil, Trash2, Search, ChevronUp, ChevronDown, Users, MoreVertical } from "lucide-react";

import {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  editMessage as editMessageApi,
  deleteMessage as deleteMessageApi,
  searchMessages,
} from "../services/chatService";
import { connectSocket, onSocketEvent } from "../services/socketService";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");

// Small fixed set covering the common reactions people actually reach for in
// a work chat — avoids pulling in a whole emoji-picker dependency for this.
const EMOJI_OPTIONS = [
  "😀", "😂", "😊", "🙂", "😉", "😍", "😎", "🤔", "😅", "😢",
  "😮", "🙌", "👍", "👎", "🙏", "👏", "🔥", "🎉", "✅", "❌",
  "❤️", "💯", "🚀", "😴", "🤝", "📌", "⚠️", "👀", "💪", "🤷",
];

// 5MB cap keeps a base64-encoded attachment comfortably under the server's
// 15mb JSON body limit (base64 adds ~33% overhead) with room for other files
// in the same conversation history.
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

// Temporary dummy employee data for frontend demonstration.
// Replace with backend API response after integration.
const DUMMY_EMPLOYEES = [
  { id: "EMP001", name: "Sai Teja", dept: "IT", role: "Software Engineer" },
  { id: "EMP002", name: "Keshav Rao", dept: "IT", role: "Software Engineer" },
  { id: "EMP003", name: "Rahul Kumar", dept: "HR", role: "HR Executive" },
  { id: "EMP004", name: "Priya Sharma", dept: "Finance", role: "Accountant" },
  { id: "EMP005", name: "Arjun Reddy", dept: "Marketing", role: "Marketing Executive" },
  { id: "EMP006", name: "Sneha Patel", dept: "Sales", role: "Sales Executive" },
];

const ChatPage = () => {
  const [team, setTeam] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [showStartChat, setShowStartChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null); // { url, name, type }
  const [attachError, setAttachError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  // Group Chat states
  const [activeTab, setActiveTab] = useState("individual"); // 'individual' or 'groups'
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "", members: [] });
  const [groupEmployeeSearch, setGroupEmployeeSearch] = useState("");
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [listSearch, setListSearch] = useState("");

  // "Search in this chat" — WhatsApp-style find + next/previous
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef(null);
  const messageRefs = useRef({});

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const data = await getIncomingRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load chat requests:", err);
    }
  }, []);

  const loadTeam = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/team`, {
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) {
        setTeam((data.users || []).filter((u) => u.id !== currentUser?.id));
      }
    } catch (err) {
      console.error("Failed to load team:", err);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    loadConversations();
    loadRequests();
    loadTeam();
    connectSocket();
  }, [loadConversations, loadRequests, loadTeam]);

  // Live updates via socket
  useEffect(() => {
    const bump = () => window.dispatchEvent(new Event("crm_chat_unread_updated"));
    const unsubscribers = [
      onSocketEvent("chat:request-received", () => { loadRequests(); bump(); }),
      onSocketEvent("chat:request-accepted", () => loadConversations()),
      onSocketEvent("chat:conversation-started", () => loadConversations()),
      onSocketEvent("chat:message-received", ({ message, conversationId }) => {
        loadConversations();
        bump();
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) => [...prev, message]);
          }
          return current;
        });
      }),
      // The other person just opened the chat — flip my sent messages'
      // ticks from single (sent) to double-blue (read).
      onSocketEvent("chat:messages-read", ({ conversationId, readBy }) => {
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) =>
              prev.map((m) => (m.senderId !== readBy ? { ...m, readAt: m.readAt || new Date().toISOString() } : m))
            );
          }
          return current;
        });
      }),
      onSocketEvent("chat:message-edited", ({ message }) => {
        setActiveConversation((current) => {
          if (current?.id === message.conversationId) {
            setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)));
          }
          return current;
        });
      }),
      onSocketEvent("chat:message-deleted", ({ messageId, conversationId }) => {
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, deleted: true, message: "", attachmentUrl: null } : m)));
          }
          return current;
        });
      }),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [loadConversations, loadRequests]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    setShowEmojiPicker(false);
    setPendingAttachment(null);
    setAttachError("");
    closeSearch();
    try {
      const data = await getMessages(conversation.id);
      setMessages(data || []);
      // The server already zeroed this conversation's unread counter (opening
      // it = reading it) — reflect that locally so the sidebar badge and the
      // conversation-list badge update immediately without a refetch.
      setConversations((prev) => prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c)));
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const openGroupConversation = (group) => {
    setActiveConversation(group);
    setShowEmojiPicker(false);
    setPendingAttachment(null);
    setAttachError("");
    closeSearch();
    setMessages([]); // Mock empty messages for frontend-only
    setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, unreadCount: 0 } : g)));
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupData.name.trim()) return;
    const newGroup = {
      id: "group-" + Date.now(),
      isGroup: true,
      name: newGroupData.name,
      description: newGroupData.description,
      members: newGroupData.members,
      unreadCount: 0,
      adminId: currentUser?.id
    };
    setGroups(prev => [newGroup, ...prev]);
    setShowCreateGroup(false);
    setNewGroupData({ name: "", description: "", members: [] });
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await sendChatRequest(userId);
      setShowStartChat(false);
      if (res.conversation) {
        loadConversations();
        openConversation(res.conversation);
      } else if (res.alreadyPending) {
        alert("You already have a pending request with this person.");
      } else {
        alert("Chat request sent — waiting for them to accept.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not start chat.");
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await acceptChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      loadConversations();
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
      if (res.conversation) openConversation(res.conversation);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return;

    setAttachError("");
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachError("That file is over 5MB — please share a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingAttachment({ url: reader.result, name: file.name, type: file.type });
    };
    reader.onerror = () => setAttachError("Couldn't read that file — please try again.");
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emoji) => {
    setDraft((prev) => prev + emoji);
  };

  const startEdit = (m) => {
    setEditingMessageId(m.id);
    setEditDraft(m.message);
    setShowEmojiPicker(false);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditDraft("");
  };

  const saveEdit = async (messageId) => {
    const text = editDraft.trim();
    if (!text) return;
    try {
      const updated = await editMessageApi(messageId, text);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
      setEditingMessageId(null);
      setEditDraft("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not edit that message.");
    }
  };

  const handleDeleteMessage = async (m) => {
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    try {
      await deleteMessageApi(m.id);
      setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, deleted: true, message: "", attachmentUrl: null } : msg)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete that message.");
    }
  };

  const scrollToMatch = (matchId) => {
    messageRefs.current[matchId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Debounced (300ms) search-in-chat, same shape as the WhatsApp-style flow:
  // type -> pause -> query -> highlight all matches -> jump to the first one.
  useEffect(() => {
    if (!showSearchBar || !activeConversation) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!searchTerm.trim()) {
      setSearchMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    setSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const matches = await searchMessages(activeConversation.id, searchTerm.trim());
        setSearchMatches(matches || []);
        setCurrentMatchIndex(0);
        if (matches?.length) setTimeout(() => scrollToMatch(matches[0].id), 50);
      } catch (err) {
        console.error("Chat search failed:", err);
        setSearchMatches([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounceRef.current);
  }, [searchTerm, showSearchBar, activeConversation]);

  const goToNextMatch = () => {
    if (!searchMatches.length) return;
    const next = (currentMatchIndex + 1) % searchMatches.length; // loop to first after the last
    setCurrentMatchIndex(next);
    scrollToMatch(searchMatches[next].id);
  };

  const goToPrevMatch = () => {
    if (!searchMatches.length) return;
    const prev = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length; // loop to last before the first
    setCurrentMatchIndex(prev);
    scrollToMatch(searchMatches[prev].id);
  };

  const closeSearch = () => {
    setShowSearchBar(false);
    setSearchTerm("");
    setSearchMatches([]);
    setCurrentMatchIndex(0);
  };

  const searchInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.shiftKey ? goToPrevMatch() : goToNextMatch();
    } else if (e.key === "Escape") {
      closeSearch();
    }
  };

  // Splits message text around the search term (case-insensitive) and wraps
  // matches in <mark> — brighter highlight for whichever match is "current".
  const renderHighlightedText = (text, messageId) => {
    const term = searchTerm.trim();
    if (!showSearchBar || !term) return text;

    const isCurrentMatchMessage = searchMatches[currentMatchIndex]?.id === messageId;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: isCurrentMatchMessage ? "#fb923c" : "#fde68a",
            padding: "0 1px",
            borderRadius: "2px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text && !pendingAttachment) return;
    if (!activeConversation) return;

    setDraft("");
    setShowEmojiPicker(false);
    const attachment = pendingAttachment;
    setPendingAttachment(null);

    if (activeConversation.isGroup) {
      // Frontend-only group message mockup
      const mockMessage = {
        id: "mock-" + Date.now(),
        conversationId: activeConversation.id,
        senderId: currentUser?.id,
        message: text,
        attachmentUrl: attachment?.url || null,
        attachmentName: attachment?.name || null,
        attachmentType: attachment?.type || null,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, mockMessage]);
      return;
    }

    try {
      const message = await sendMessageApi(activeConversation.id, text, attachment);
      setMessages((prev) => [...prev, message]);
      loadConversations();
    } catch (err) {
      alert("Message failed to send.");
    }
  };

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <div className="border-end d-flex flex-column" style={{ width: "320px" }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="fw-bold m-0">Chats</h6>
          {activeTab === "individual" ? (
            <button
              className="btn btn-sm btn-brand d-flex align-items-center gap-1"
              onClick={() => setShowStartChat(true)}
            >
              <UserPlus size={14} /> New
            </button>
          ) : (
            currentUser?.role === "admin" && (
              <button
                className="btn btn-sm btn-brand d-flex align-items-center gap-1"
                onClick={() => setShowCreateGroup(true)}
              >
                <Users size={14} /> + Create Group
              </button>
            )
          )}
        </div>

        <div className="d-flex border-bottom">
          <button
            className={`flex-fill py-2 border-0 bg-transparent fw-medium ${activeTab === "individual" ? "text-primary border-bottom border-primary border-2" : "text-muted"}`}
            onClick={() => { setActiveTab("individual"); setListSearch(""); }}
          >
            Individual
          </button>
          <button
            className={`flex-fill py-2 border-0 bg-transparent fw-medium ${activeTab === "groups" ? "text-primary border-bottom border-primary border-2" : "text-muted"}`}
            onClick={() => { setActiveTab("groups"); setListSearch(""); }}
          >
            Groups
          </button>
        </div>
        
        <div className="p-2 border-bottom bg-light">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={14} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder={`Search ${activeTab === "individual" ? "conversations" : "groups"}...`}
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-fill" style={{ overflowY: "auto" }}>
          {activeTab === "individual" ? (
            <>
              {requests.length > 0 && !listSearch && (
                <div className="p-3 border-bottom bg-light">
                  <div className="small fw-bold text-muted mb-2">CHAT REQUESTS</div>
                  {requests.map((r) => (
                    <div key={r.id} className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small">{r.sender?.fullName || "Someone"} wants to chat</span>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-success" onClick={() => handleAccept(r.id)}>
                          <Check size={12} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDecline(r.id)}>
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div>
                {conversations.filter(c => !listSearch || (c.otherUser?.fullName || "").toLowerCase().includes(listSearch.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-muted small">No personal chats exist.</div>
                )}
                {conversations
                  .filter(c => !listSearch || (c.otherUser?.fullName || "").toLowerCase().includes(listSearch.toLowerCase()))
                  .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c)}
                    className={`w-100 text-start border-0 p-3 border-bottom d-flex justify-content-between align-items-center ${
                      activeConversation?.id === c.id ? "bg-light" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="fw-medium">{c.otherUser?.fullName || "Unknown"}</div>
                      <div className="small text-muted">{c.otherUser?.email}</div>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="badge rounded-pill bg-danger">{c.unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              {groups.filter(g => !listSearch || g.name.toLowerCase().includes(listSearch.toLowerCase())).length === 0 && (
                <div className="p-5 text-center text-muted">
                  <div className="fw-medium mb-1">No Groups Available</div>
                  <div className="small">
                    {currentUser?.role === "admin"
                      ? "Create your first group to start collaborating."
                      : "Groups assigned by your Administrator will appear here."}
                  </div>
                </div>
              )}
              {groups
                .filter(g => !listSearch || g.name.toLowerCase().includes(listSearch.toLowerCase()))
                .map((g) => (
                <button
                  key={g.id}
                  onClick={() => openGroupConversation(g)}
                  className={`w-100 text-start border-0 p-3 border-bottom d-flex justify-content-between align-items-center ${
                    activeConversation?.id === g.id ? "bg-light" : "bg-white"
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="fw-medium">{g.name}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>
                        {g.description || `${g.members?.length || 0} members`}
                      </div>
                    </div>
                  </div>
                  {g.unreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger">{g.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation window */}
      <div className="flex-fill d-flex flex-column">
        {activeConversation ? (
          <>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold">
                  {activeConversation.isGroup ? activeConversation.name : (activeConversation.otherUser?.fullName || "Chat")}
                </span>
                {activeConversation.isGroup && (
                  <span className="badge bg-light text-secondary border">{activeConversation.members?.length || 0} Members</span>
                )}
              </div>
              <div className="d-flex gap-2 position-relative">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                  title="Search in this chat"
                  onClick={() => (showSearchBar ? closeSearch() : setShowSearchBar(true))}
                >
                  <Search size={14} />
                </button>
                {activeConversation.isGroup && currentUser?.role === "admin" && (
                  <div className="position-relative">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                      title="Manage Group"
                      onClick={() => setShowGroupMenu(!showGroupMenu)}
                    >
                      <MoreVertical size={14} />
                    </button>
                    {showGroupMenu && (
                      <div className="position-absolute bg-white border rounded shadow-sm py-1 mt-1 z-3" style={{ right: 0, width: "160px" }}>
                        <button className="btn btn-sm btn-link text-dark w-100 text-start text-decoration-none px-3" onClick={() => { alert('Rename Group mock'); setShowGroupMenu(false); }}>Rename Group</button>
                        <button className="btn btn-sm btn-link text-dark w-100 text-start text-decoration-none px-3" onClick={() => { alert('Edit Description mock'); setShowGroupMenu(false); }}>Edit Description</button>
                        <button className="btn btn-sm btn-link text-dark w-100 text-start text-decoration-none px-3" onClick={() => { alert('Add Members mock'); setShowGroupMenu(false); }}>Add Members</button>
                        <button className="btn btn-sm btn-link text-dark w-100 text-start text-decoration-none px-3" onClick={() => { alert('Remove Members mock'); setShowGroupMenu(false); }}>Remove Members</button>
                        <hr className="my-1" />
                        <button className="btn btn-sm btn-link text-danger w-100 text-start text-decoration-none px-3" onClick={() => { 
                          if(window.confirm('Delete this group?')) {
                            setGroups(prev => prev.filter(g => g.id !== activeConversation.id));
                            setActiveConversation(null);
                          }
                          setShowGroupMenu(false); 
                        }}>Delete Group</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showSearchBar && (
              <div className="p-2 border-bottom bg-light d-flex align-items-center gap-2">
                <Search size={14} className="text-muted ms-1" />
                <input
                  type="text"
                  autoFocus
                  className="form-control form-control-sm border-0 bg-transparent"
                  placeholder="Search in this chat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={searchInputKeyDown}
                />
                <span className="small text-muted text-nowrap" style={{ minWidth: "50px" }}>
                  {searching
                    ? "..."
                    : searchTerm.trim()
                    ? searchMatches.length
                      ? `${currentMatchIndex + 1} / ${searchMatches.length}`
                      : "0 / 0"
                    : ""}
                </span>
                <button type="button" className="btn btn-sm btn-light" title="Previous (Shift+Enter)" disabled={!searchMatches.length} onClick={goToPrevMatch}>
                  <ChevronUp size={14} />
                </button>
                <button type="button" className="btn btn-sm btn-light" title="Next (Enter)" disabled={!searchMatches.length} onClick={goToNextMatch}>
                  <ChevronDown size={14} />
                </button>
                <button type="button" className="btn btn-sm btn-light" title="Close" onClick={closeSearch}>
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex-fill p-3" style={{ overflowY: "auto" }}>
              {messages.map((m) => {
                const isMine = m.senderId === currentUser?.id;
                const isEditing = editingMessageId === m.id;

                if (m.deleted) {
                  return (
                    <div key={m.id} className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                      <div className="px-3 py-2 rounded-3 bg-light text-muted fst-italic" style={{ maxWidth: "60%", fontSize: "13px" }}>
                        This message was deleted
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    ref={(el) => (messageRefs.current[m.id] = el)}
                    className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div className="d-flex align-items-start gap-1" style={{ maxWidth: "60%" }}>
                      {isMine && !isEditing && (
                        <div className="d-flex gap-1 pt-1">
                          <button type="button" className="btn btn-sm btn-link text-muted p-0" title="Edit" onClick={() => startEdit(m)}>
                            <Pencil size={12} />
                          </button>
                          <button type="button" className="btn btn-sm btn-link text-muted p-0" title="Delete" onClick={() => handleDeleteMessage(m)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-3 ${isMine ? "bg-primary text-white" : "bg-light"}`}
                        style={{ minWidth: isEditing ? "220px" : "auto" }}
                      >
                        {isEditing ? (
                          <div className="d-flex flex-column gap-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(m.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                            />
                            <div className="d-flex gap-2 justify-content-end">
                              <button type="button" className="btn btn-sm btn-light" onClick={cancelEdit}>Cancel</button>
                              <button type="button" className="btn btn-sm btn-light" onClick={() => saveEdit(m.id)}>Save</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {m.attachmentUrl && (
                              m.attachmentType?.startsWith("image/") ? (
                                <a href={m.attachmentUrl} target="_blank" rel="noreferrer">
                                  <img
                                    src={m.attachmentUrl}
                                    alt={m.attachmentName || "attachment"}
                                    style={{ maxWidth: "220px", maxHeight: "220px", borderRadius: "8px", display: "block", marginBottom: m.message ? "6px" : 0 }}
                                  />
                                </a>
                              ) : (
                                <a
                                  href={m.attachmentUrl}
                                  download={m.attachmentName}
                                  className={`d-flex align-items-center gap-2 mb-1 ${isMine ? "text-white" : "text-dark"}`}
                                  style={{ textDecoration: "underline" }}
                                >
                                  <FileText size={16} /> {m.attachmentName || "Download file"}
                                </a>
                              )
                            )}
                            {renderHighlightedText(m.message, m.id)}
                            <div className={`d-flex align-items-center gap-1 justify-content-end mt-1 ${isMine ? "text-white-50" : "text-muted"}`} style={{ fontSize: "10px" }}>
                              {m.edited && <span>edited</span>}
                              {isMine && (m.readAt ? <CheckCheck size={13} color="#8ec9ff" /> : <Check size={13} />)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {pendingAttachment && (
              <div className="px-3 pt-2 d-flex align-items-center gap-2 small text-muted border-top">
                {pendingAttachment.type?.startsWith("image/") ? (
                  <img src={pendingAttachment.url} alt="" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                ) : (
                  <FileText size={16} />
                )}
                <span className="flex-fill text-truncate">{pendingAttachment.name}</span>
                <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => setPendingAttachment(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
            {attachError && <div className="px-3 pt-1 small text-danger">{attachError}</div>}
            <form onSubmit={handleSend} className="p-3 border-top d-flex gap-2 align-items-center position-relative">
              {showEmojiPicker && (
                <div
                  className="position-absolute bg-white border rounded-3 shadow p-2"
                  style={{ bottom: "56px", left: "12px", width: "260px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", zIndex: 20 }}
                >
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      className="btn btn-light p-1"
                      style={{ fontSize: "18px", lineHeight: 1 }}
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChosen}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center"
                title="Attach a photo or document"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center"
                title="Emoji"
                onClick={() => setShowEmojiPicker((v) => !v)}
              >
                <Smile size={16} />
              </button>
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
              />
              <button type="submit" className="btn btn-brand d-flex align-items-center">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-fill d-flex flex-column align-items-center justify-content-center text-muted">
            <MessageCircle size={40} className="mb-2" />
            Select a conversation or start a new one
          </div>
        )}
      </div>

      {/* Start chat modal */}
      {showStartChat && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
          onClick={() => setShowStartChat(false)}
        >
          <div className="bg-white rounded-3 p-4" style={{ width: "360px" }} onClick={(e) => e.stopPropagation()}>
            <h6 className="fw-bold mb-3">Start a chat</h6>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {team.map((u) => (
                <button
                  key={u.id}
                  className="w-100 text-start btn btn-light mb-1"
                  onClick={() => handleStartChat(u.id)}
                >
                  {u.fullName} <span className="text-muted small">({u.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Group modal (Admin only) */}
      {showCreateGroup && currentUser?.role === "admin" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
          onClick={() => setShowCreateGroup(false)}
        >
          <div className="bg-white rounded-3 shadow d-flex flex-column" style={{ width: "650px", maxHeight: "90vh", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 border-bottom d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1">Create Group</h5>
                <div className="text-muted small">Create a communication group for employees.</div>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowCreateGroup(false)} aria-label="Close"></button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="d-flex flex-column flex-fill" style={{ overflowY: "auto" }}>
              <div className="p-4">
                <div className="mb-4">
                  <label className="form-label small fw-bold mb-2">Group Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={newGroupData.name}
                    onChange={(e) => setNewGroupData({...newGroupData, name: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold mb-2">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="2"
                    value={newGroupData.description}
                    onChange={(e) => setNewGroupData({...newGroupData, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="form-label small fw-bold mb-2">Search Employees</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <Search size={16} />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 ps-0" 
                      placeholder="Search by name, ID, department..." 
                      value={groupEmployeeSearch}
                      onChange={(e) => setGroupEmployeeSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="small fw-bold mb-2 text-muted">Available Employees</div>
                    <div className="border rounded bg-light p-2 d-flex flex-column gap-2" style={{ height: "250px", overflowY: "auto" }}>
                      {(() => {
                        const filtered = DUMMY_EMPLOYEES.filter(e => 
                          !groupEmployeeSearch || 
                          e.name.toLowerCase().includes(groupEmployeeSearch.toLowerCase()) ||
                          e.id.toLowerCase().includes(groupEmployeeSearch.toLowerCase()) ||
                          e.dept.toLowerCase().includes(groupEmployeeSearch.toLowerCase()) ||
                          e.role.toLowerCase().includes(groupEmployeeSearch.toLowerCase())
                        );
                        if(filtered.length === 0) return <div className="text-muted small text-center mt-3">No employees found.</div>;
                        return filtered.map(emp => (
                          <div 
                            key={emp.id} 
                            className="bg-white border rounded p-2 d-flex align-items-center gap-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if(!newGroupData.members.includes(emp.id)) {
                                setNewGroupData(prev => ({ ...prev, members: [...prev.members, emp.id] }));
                              }
                            }}
                          >
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "32px", height: "32px", fontSize: "12px", fontWeight: "bold" }}>
                              {emp.name.split(" ").map(n => n[0]).join("").substring(0,2)}
                            </div>
                            <div style={{ lineHeight: "1.2" }}>
                              <div className="fw-medium small">{emp.name}</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>{emp.id} • {emp.dept}</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>{emp.role}</div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="small fw-bold mb-2 text-muted">Selected Members</div>
                    <div className="border rounded bg-light p-3 d-flex flex-wrap gap-2 align-content-start" style={{ height: "250px", overflowY: "auto" }}>
                      {newGroupData.members.length === 0 ? (
                        <div className="text-muted small text-center w-100 mt-2">No members selected.</div>
                      ) : (
                        newGroupData.members.map(memberId => {
                          const emp = DUMMY_EMPLOYEES.find(e => e.id === memberId);
                          if(!emp) return null;
                          return (
                            <div key={memberId} className="badge bg-white text-dark border d-flex align-items-center gap-1 py-1 px-2" style={{ fontSize: "12px" }}>
                              {emp.name}
                              <X size={14} className="text-muted ms-1" style={{ cursor: "pointer" }} onClick={() => {
                                setNewGroupData(prev => ({ ...prev, members: prev.members.filter(id => id !== memberId) }));
                              }} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-top bg-light d-flex justify-content-end gap-2 mt-auto">
                <button type="button" className="btn btn-light border" onClick={() => setShowCreateGroup(false)}>Cancel</button>
                <button type="submit" className="btn btn-brand" disabled={!newGroupData.name.trim() || newGroupData.members.length === 0}>Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
