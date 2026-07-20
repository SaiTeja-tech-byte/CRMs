import React, { createContext, useState, useContext } from 'react';

const CRMContext = createContext();

export const useCRMContext = () => useContext(CRMContext);

export const CRMProvider = ({ children }) => {
  // ----------------------------------------------------
  // Mock Datasets (Shared state)
  // ----------------------------------------------------
  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    dob: "",
    gender: "",
    nationality: "",
    employeeId: "SH100332",
    designation: "",
    department: "",
    company: "SHNOOR International LLC",
    officeLocation: "",
    employmentType: "",
    joiningDate: "2026-07-14",
    reportingManager: "",
    employmentStatus: "Active",
    officialEmail: "",
    personalEmail: "",
    phoneNumber: "",
    alternatePhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    bio: "",
    skills: "",
    experience: "",
    languagesKnown: "",
    avatar: "",
    linkedin: "",
    portfolio: "",
    github: "",
    website: "",
    defaultDashboard: "Sales",
    defaultPipeline: "Standard",
    currency: "INR (₹)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
    notificationPreference: "Email & Push Alerts",
    username: "keshav_pilli",
    role: "Software Developer Intern",
    accountStatus: "Active",
    lastLogin: "14/07/2026 09:30 AM",
    createdOn: "23/06/2026",
    theme: "Light",
    language: "English",
    timeZone: "GMT+5:30 (IST)",
    notifEmail: true,
    notifPush: true
  });

  const [tasks, setTasks] = useState([]);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Contract signed by Stark Corp", time: "5 mins ago", icon: "bi-file-earmark-check", color: "text-success", isRead: false },
    { id: 2, text: "Payment received from Google", time: "30 mins ago", icon: "bi-wallet2", color: "text-success", isRead: false },
    { id: 3, text: "Lead assigned: Amazon Web Services", time: "1 hour ago", icon: "bi-person-badge", color: "text-info", isRead: false }
  ]);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "Sarah Connor", excerpt: "Can you review the Amazon budget outline?", time: "9:40 AM" },
    { id: 2, sender: "John Doe", excerpt: "Tesla proposal looks ready to close.", time: "Yesterday" }
  ]);
  
  const [events, setEvents] = useState([]);
  
  // Example Team Members
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "TM-001",
      employeeId: "EMP001",
      firstName: "Sarah",
      lastName: "Connor",
      email: "sarah.connor@example.com",
      phone: "+1 (555) 123-4567",
      department: "Engineering",
      designation: "Senior Developer",
      reportingManager: "John Doe",
      officeLocation: "New York",
      joiningDate: "2023-01-15",
      employmentStatus: "Full-Time",
      status: "Online",
      role: "Employee"
    },
    {
      id: "TM-002",
      employeeId: "EMP002",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 987-6543",
      department: "Sales",
      designation: "Sales Manager",
      reportingManager: "Jane Smith",
      officeLocation: "London",
      joiningDate: "2022-11-01",
      employmentStatus: "Full-Time",
      status: "Away",
      role: "Manager"
    }
  ]);
  
  // Example Documents
  const [documents, setDocuments] = useState([
    {
      id: "doc-1",
      name: "Employee Handbook 2026.pdf",
      type: "File",
      extension: ".pdf",
      category: "HR Policies",
      department: "HR",
      size: "2.4 MB",
      uploadedBy: "Admin",
      lastModified: "2026-01-10",
      status: "Shared",
      visibility: "Everyone"
    },
    {
      id: "doc-2",
      name: "Sales Targets Q3.xlsx",
      type: "File",
      extension: ".xlsx",
      category: "Sales",
      department: "Sales",
      size: "1.1 MB",
      uploadedBy: "John Doe",
      lastModified: "2026-07-01",
      status: "Private",
      visibility: "Specific Department"
    }
  ]);

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: "SHNOOR International LLC",
    companyEmail: "contact@shnoor.com",
    phoneNumber: "+1 800 123 4567",
    website: "www.shnoor.com",
    companyAddress: "123 Business Avenue",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    businessType: "Technology",
    industry: "Software",
    companySize: "50-200",
    foundedYear: "2010",
    workingDays: "Monday - Friday",
    workingHours: "9:00 AM - 5:00 PM",
    timezone: "GMT-5:00 (EST)",
    currency: "USD ($)",
    dateFormat: "MM/DD/YYYY",
    smtpHost: "smtp.mailgun.org",
    smtpPort: "587",
    senderEmail: "no-reply@shnoor.com",
    senderName: "SHNOOR Notifications",
    replyToEmail: "support@shnoor.com",
    enableEmailNotif: true,
    enablePushNotif: true,
    enableEmployeeAlerts: true,
    enableCompanyAnnouncements: true,
    enableTaskNotif: true,
    enableCalendarReminders: true,
    enableNewsNotif: true,
    sessionTimeout: "30 minutes",
    passwordPolicy: "Strong",
    maxLoginAttempts: "5",
    enableAuditLogs: true,
    allowEmployeeProfileEditing: true,
    lastBackupDate: "2026-07-15 02:00 AM",
    backupStatus: "Success",
    storageUsed: "45 GB / 100 GB"
  });

  return (
    <CRMContext.Provider value={{
      profile, setProfile,
      tasks, setTasks,
      notifications, setNotifications,
      messages, setMessages,
      events, setEvents,
      teamMembers, setTeamMembers,
      documents, setDocuments,
      companySettings, setCompanySettings
    }}>
      {children}
    </CRMContext.Provider>
  );
};
