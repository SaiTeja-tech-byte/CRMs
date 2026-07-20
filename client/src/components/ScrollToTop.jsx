import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Real React Router doesn't auto-scroll to top on navigation the way the
// old custom router used to (it called window.scrollTo manually). This
// restores that behavior for every route change, hash links excluded.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
