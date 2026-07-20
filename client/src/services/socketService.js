import { io } from "socket.io-client";

// Strips a trailing "/auth" (in case VITE_API_URL matches authService.js's
// convention) and then "/api", leaving just the server host — which is what
// Socket.IO needs to connect to (it isn't a REST path).
const SOCKET_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api")
  .replace(/\/auth\/?$/, "")
  .replace(/\/api\/?$/, "");

let socket = null;

// Call once after login (token is in localStorage by then). Safe to call
// repeatedly — it reuses the existing connection instead of opening a new one.
export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (socket && socket.connected) return socket;

  socket = io(SOCKET_BASE, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// Subscribe to a live event; returns an unsubscribe function so callers can
// clean up in a useEffect return. Connects lazily if not already connected.
export const onSocketEvent = (event, handler) => {
  const s = socket || connectSocket();
  if (!s) return () => {};
  s.on(event, handler);
  return () => s.off(event, handler);
};
