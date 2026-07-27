import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// Marketing / existing pages (all built by teammate)
// Lazy-loaded so each route ships its own chunk instead of one giant bundle
const Landing = lazy(() => import("./pages/Landing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LegalCenter = lazy(() => import("./pages/LegalCenter"));
const PolicyDetail = lazy(() => import("./pages/PolicyDetail"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ResponsibleDisclosure = lazy(() => import("./pages/ResponsibleDisclosure"));
const CookiePreferences = lazy(() => import("./pages/CookiePreferences"));
const CRMGuide = lazy(() => import("./pages/CRMGuide"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const Resources = lazy(() => import("./pages/Resources"));
const TrustCenter = lazy(() => import("./pages/TrustCenter"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AdminContactQueries = lazy(() => import("./pages/AdminContactQueries"));

// Auth pages
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const TwoFactor = lazy(() => import("./pages/auth/TwoFactor"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PageLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/trust-center" element={<TrustCenter />} />
          <Route path="/crm-guide" element={<CRMGuide />} />
          <Route path="/legal" element={<LegalCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/responsible-disclosure" element={<ResponsibleDisclosure />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />

          {/* Detail sub-pages, each keyed by its own path (same as before) */}
          <Route path="/cookie-policy" element={<PolicyDetail path="/cookie-policy" />} />
          <Route path="/accessibility" element={<PolicyDetail path="/accessibility" />} />
          <Route path="/acceptable-use" element={<PolicyDetail path="/acceptable-use" />} />
          <Route path="/data-processing-agreement" element={<PolicyDetail path="/data-processing-agreement" />} />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/verify-otp" element={<TwoFactor />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard - requires login */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          {/* Chat - requires login, available to both employees and admins */}
          <Route
            path="/chat"
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />

          {/* Admin dashboard - requires login AND admin role */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />

          {/* Customer contact queries - admin only */}
          <Route
            path="/admin/queries"
            element={
              <RequireAdmin>
                <AdminContactQueries />
              </RequireAdmin>
            }
          />

          {/* Anything unmatched falls back to the landing page */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
