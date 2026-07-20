const PasswordStrength = ({ password = "" }) => {
  const checks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(password) },
    { label: "Lowercase", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
    { label: "Special char", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;
  const colors = ["bg-danger", "bg-warning", "bg-warning", "bg-info", "bg-success"];
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mb-3">
      <div className="d-flex gap-1 mb-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-fill ${i < score ? colors[score - 1] : "bg-light border"}`}
            style={{ height: "4px", borderRadius: "2px" }}
          />
        ))}
      </div>
      <div className="small text-muted mb-1">{score === 0 ? "Very weak" : labels[score - 1]}</div>
      <div className="row row-cols-2 g-1">
        {checks.map((c) => (
          <div key={c.label} className={`col small ${c.valid ? "text-success" : "text-muted"}`}>
            {c.valid ? "✓" : "·"} {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
