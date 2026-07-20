import { useState, useEffect, useRef } from "react";
import { getUnreadNotificationCount } from "../services/notificationService";
import { onSocketEvent } from "../services/socketService";

// Powers the badge next to "Notifications" in both sidebars (Dashboard.jsx's
// own copy and the shared components/layout/Sidebar.jsx used by
// AdminDashboard.jsx) — same pattern as useChatUnreadCount, so the count is
// global (backend-backed, not tied to whichever tab happens to be open) and
// updates live no matter which tab the user is currently on.
const useNotificationUnreadCount = () => {
  const [count, setCount] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const refresh = () => {
      getUnreadNotificationCount()
        .then((c) => { if (mountedRef.current) setCount(c || 0); })
        .catch(() => {});
    };

    refresh();
    const interval = setInterval(refresh, 20000);

    window.addEventListener("crm_notifications_updated", refresh);
    const unsubscribers = [
      onSocketEvent("notification:new", refresh),
      onSocketEvent("leave:new", refresh),
      onSocketEvent("leave:updated", refresh),
    ];

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      window.removeEventListener("crm_notifications_updated", refresh);
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, []);

  return count;
};

export default useNotificationUnreadCount;
