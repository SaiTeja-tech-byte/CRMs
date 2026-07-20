import { Zap } from "lucide-react";

const Badge = ({ children }) => (
  <span className="auth-badge">
    <Zap size={12} />
    {children}
  </span>
);

export default Badge;
