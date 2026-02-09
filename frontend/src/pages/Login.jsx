import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        const data = await registerUser({ name, email, password });
        setSuccess("Registration successful! Please login.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        const data = await loginUser({ email, password });
        localStorage.setItem("token", data.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || (isRegister ? "Registration failed" : "Login failed"));
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>

      {error && <p className="login-error">{error}</p>}
      {success && <p style={{ color: "#16a34a", textAlign: "center", marginBottom: "10px" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px", color: "#6b7280" }}>
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setSuccess("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
