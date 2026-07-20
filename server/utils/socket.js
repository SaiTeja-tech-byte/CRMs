const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "role", "department"],
      });
      if (!user) return next(new Error("User no longer exists"));

      socket.userId = user.id;
      socket.userRole = user.role;
      socket.userDepartment = user.department;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
    socket.join("broadcast:all");
    if (socket.userDepartment) socket.join(`dept:${socket.userDepartment}`);
    if (socket.userRole === "admin") socket.join("role:admin");
  });

  return io;
};

const getIO = () => io;

const emitToUser = (userId, event, payload) => {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit(event, payload);
};

const emitToDepartment = (department, event, payload) => {
  if (!io || !department) return;
  io.to(`dept:${department}`).emit(event, payload);
};

const emitToAll = (event, payload) => {
  if (!io) return;
  io.to("broadcast:all").emit(event, payload);
};

const emitToAdmins = (event, payload) => {
  if (!io) return;
  io.to("role:admin").emit(event, payload);
};

module.exports = { initSocket, getIO, emitToUser, emitToDepartment, emitToAll, emitToAdmins };
