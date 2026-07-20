import { useState, useEffect, useRef } from "react";
import { getUnreadCount } from "../services/chatService";
import { onSocketEvent } from "../services/socketService";

// Powers the little badge next to "Chat" in both sidebars (employee's local
// copy in Dashboard.jsx, and the shared components/layout/Sidebar.jsx used
// by AdminDashboard.jsx). Combines unread messages + pending chat requests
// into one number, refreshed on a poll, on relevant socket events, and on
// the "crm_chat_unread_updated" window event ChatPage.jsx fires whenever it
// changes something locally (e.g. opening a conversation clears its unread
// count faster than the next poll would).
const useChatUnreadCount = () => {
  const [count, setCount] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const refresh = () => {
      getUnreadCount()
        .then((data) => { if (mountedRef.current) setCount(data?.total || 0); })
        .catch(() => {});
    };

    refresh();
    const interval = setInterval(refresh, 20000);

    window.addEventListener("crm_chat_unread_updated", refresh);
    const unsubscribers = [
      onSocketEvent("chat:message-received", refresh),
      onSocketEvent("chat:request-received", refresh),
      onSocketEvent("chat:request-accepted", refresh),
      onSocketEvent("chat:conversation-started", refresh),
    ];

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      window.removeEventListener("crm_chat_unread_updated", refresh);
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, []);

  return count;
};

export default useChatUnreadCount;
