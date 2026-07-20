import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// Marketing / existing pages (all built by teammate)
import Landing from "./pages/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalCenter from "./pages/LegalCenter";
import PolicyDetail from "./pages/PolicyDetail";
import TermsOfService from "./pages/TermsOfService";
import ResponsibleDisclosure from "./pages/ResponsibleDisclosure";
import CookiePreferences from "./pages/CookiePreferences";
import CRMGuide from "./pages/CRMGuide";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import TrustCenter from "./pages/TrustCenter";
import Dashboard from "./pages/Dashboard";

// Auth pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import TwoFactor from "./pages/auth/TwoFactor";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <ScrollToTop />
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

        {/* Admin dashboard - requires login AND admin role */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* Anything unmatched falls back to the landing page */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
