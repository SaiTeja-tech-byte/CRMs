import { Navigate } from "react-router-dom";

// Wrap any route that should require login, e.g.:
// <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
