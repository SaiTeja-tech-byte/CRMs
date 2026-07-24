import { useState, useEffect, useRef } from "react";
import { getUnreadNotificationCount } from "../services/notificationService";
import { onSocketEvent } from "../services/socketService";

const useNotificationUnreadCount = (type) => {
  const [count, setCount] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const refresh = () => {
      getUnreadNotificationCount(type)
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
  }, [type]);

  return count;
};

export default useNotificationUnreadCount;
