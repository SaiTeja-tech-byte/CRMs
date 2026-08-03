const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const { apiLimiter } = require("./middleware/rateLimiter");

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
const leaveRoutes = require("./routes/leaveRoutes");
const contactRoutes = require("./routes/contactRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

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
require("./models/ChatGroup");
require("./models/GroupMember");
require("./models/OrgChartNode");
require("./models/LeaveRequest");
require("./models/ContactQuery");
require("./models/Feedback");
require("./models/Expense");
require("./models/Ticket");
require("./models/Payroll");
require("./models/AttendanceRegularization");
require("./models/Attendance");

const app = express();
app.set("trust proxy", 1);
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(apiLimiter);
app.use(express.json({ limit: "15mb" }));

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
app.use("/api/leave", leaveRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/planner", plannerRoutes);

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

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
