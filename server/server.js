const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize, connectDB } = require("./config/db");
const { initSocket } = require("./utils/socket");

const authRoutes = require("./routes/authRoutes");
const dealRoutes = require("./routes/dealRoutes");
const taskRoutes = require("./routes/taskRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const newsRoutes = require("./routes/newsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const documentRoutes = require("./routes/documentRoutes");
const companySettingsRoutes = require("./routes/companySettingsRoutes");
const eventRoutes = require("./routes/eventRoutes");
const teamRoutes = require("./routes/teamRoutes");
const chatRoutes = require("./routes/chatRoutes");
const orgChartRoutes = require("./routes/orgChartRoutes");


require("./models/User");
require("./models/Deal");
require("./models/Task");
require("./models/Event");
require("./models/Meeting");
require("./models/ActivityLog");
require("./models/Notification");
require("./models/Message");
require("./models/Announcement");
require("./models/Document");
require("./models/CompanySettings");
require("./models/ChatRequest");
require("./models/Conversation");
require("./models/ChatMessage");
require("./models/OrgChartNode");

const app = express();
// Socket.IO needs the raw http server (not the express app) so it can
// upgrade connections to WebSockets on the same port.
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(cors());
app.use(express.json({ limit: "15mb" })); // documents are uploaded as base64, raise the default 100kb JSON limit

// Prevent browsers/proxies from caching any API response. Without this,
// GET requests (e.g. /api/tasks) can get served from the browser's HTTP
// cache on a normal refresh, showing stale data until a full logout/login
// forces a genuinely fresh request.
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/company-settings", companySettingsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/org-chart", orgChartRoutes);

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    await sequelize.sync({ alter: true });
    console.log("Database synced");
  } catch (error) {
    console.error("Could not connect/sync database. Check DATABASE_URL in .env");
    console.error(error.message);
  }

  // Listen on the http server (not app.listen) so the Socket.IO upgrade
  // handler attached in initSocket() actually gets a chance to run.
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
