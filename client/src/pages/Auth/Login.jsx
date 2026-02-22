import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP: later this will be API authentication
    if (email && password) {
      navigate("/home"); // homepage (future)
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login to Arthika</h1>

      <form style={styles.form} onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login →
        </button>
      </form>
    </div>
  );
}

/* Simple inline styles for now */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#F8EAC6",
  },
  title: {
    fontSize: "40px",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "25px",
    border: "none",
    background: "#FBC02D",
    cursor: "pointer",
    fontWeight: "600",
  },
};