import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import Dashboard from "./pages/Dashboard";

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
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AdminContactQueries = lazy(() => import("./pages/AdminContactQueries"));

const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const TwoFactor = lazy(() => import("./pages/auth/TwoFactor"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

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

function GoogleAuthRoute({ children }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
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

          <Route path="/cookie-policy" element={<PolicyDetail path="/cookie-policy" />} />
          <Route path="/accessibility" element={<PolicyDetail path="/accessibility" />} />
          <Route path="/acceptable-use" element={<PolicyDetail path="/acceptable-use" />} />
          <Route path="/data-processing-agreement" element={<PolicyDetail path="/data-processing-agreement" />} />

          <Route
            path="/register"
            element={
              <GoogleAuthRoute>
                <Register />
              </GoogleAuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GoogleAuthRoute>
                <Login />
              </GoogleAuthRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <GoogleAuthRoute>
                <AdminLogin />
              </GoogleAuthRoute>
            }
          />
          <Route path="/verify-otp" element={<TwoFactor />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/chat"
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/queries"
            element={
              <RequireAdmin>
                <AdminContactQueries />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
