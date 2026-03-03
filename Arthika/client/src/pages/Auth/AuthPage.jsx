import "./Auth.css";

export default function AuthPage({ left, right }) {
  return (
    <div className="auth-container">
      <div className="auth-left">{left}</div>
      <div className="auth-right">{right}</div>
    </div>
  );
}