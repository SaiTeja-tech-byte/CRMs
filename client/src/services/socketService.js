import { io } from "socket.io-client";

const SOCKET_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api")
  .replace(/\/auth\/?$/, "")
  .replace(/\/api\/?$/, "");

let socket = null;

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

export const onSocketEvent = (event, handler) => {
  const s = socket || connectSocket();
  if (!s) return () => {};
  s.on(event, handler);
  return () => s.off(event, handler);
};
