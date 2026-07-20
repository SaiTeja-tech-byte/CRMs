import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackHomeButton = () => {
  return (
    <Link to="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
      <ArrowLeft size={14} />
      <span className="d-none d-sm-inline">Back to Home</span>
    </Link>
  );
};

export default BackHomeButton;
