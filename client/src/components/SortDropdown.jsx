import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";


const SortDropdown = ({ options, value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!options || options.length === 0) return null;

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: "#fff",
          color: "#475569",
          fontSize: 14,
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          whiteSpace: "nowrap",
        }}
      >
        <ArrowUpDown size={14} />
        Sort: {current.label}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            zIndex: 20,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            minWidth: 190,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                border: "none",
                background: opt.value === value ? "#eff6ff" : "#fff",
                color: opt.value === value ? "#2563eb" : "#374151",
                fontSize: 14,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {opt.label}
              {opt.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
