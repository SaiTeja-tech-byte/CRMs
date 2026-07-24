import { useState, useEffect, useRef } from "react";
import { getUnreadQueryCount } from "../services/contactService";
import { onSocketEvent } from "../services/socketService";

// Same shape as useNotificationUnreadCount / useChatUnreadCount - poll as a
// fallback, but update instantly on the relevant socket events.
const useContactQueryUnreadCount = () => {
  const [count, setCount] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const refresh = () => {
      getUnreadQueryCount()
        .then((c) => { if (mountedRef.current) setCount(c || 0); })
        .catch(() => {});
    };

    refresh();
    const interval = setInterval(refresh, 20000);

    window.addEventListener("crm_queries_updated", refresh);
    const unsubscribers = [
      onSocketEvent("contact:new-query", refresh),
    ];

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      window.removeEventListener("crm_queries_updated", refresh);
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, []);

  return count;
};

export default useContactQueryUnreadCount;
