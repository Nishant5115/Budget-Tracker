import { useState } from "react";
import { loginUser, registerUser, sendOtp, verifyOtp } from "../services/authService";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (password.length < 8) {
          setError("Password must be at least 8 characters long");
          return;
        }

        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
          setError(
            "Password must contain at least one uppercase letter and one number"
          );
          return;
        }

        await registerUser({ name, email, password });
        setSuccess("Registration successful. Please sign in.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        if (useOtp) {
          if (!otpSent) {
            try {
              await sendOtp(email);
              setOtpSent(true);
              setSuccess("OTP sent to your email.");
            } catch (err) {
              setError(err.message || "Failed to send OTP");
            }
          } else {
            try {
              const data = await verifyOtp({ email, otp });
      localStorage.setItem("token", data.token);
              if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
              }
      onLoginSuccess();
    } catch (err) {
              setError(err.message || "OTP verification failed");
            }
          }
        } else {
          const data = await loginUser({ email, password });
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.message || (isRegister ? "Registration failed" : "Login failed"));
    }
  };

  return (
    <div className="login-container">
      <h2>
        {isRegister
          ? "Create account"
          : useOtp
          ? "One-time passcode"
          : "Welcome back"}
      </h2>
      <p className="login-subtitle">
        {isRegister
          ? "Set up your account to start tracking your budget."
          : useOtp
          ? "Use the OTP sent to your email to sign in."
          : "Sign in to continue managing your finances."}
      </p>

      {error && <p className="login-error">{error}</p>}
      {success && (
        <p style={{ color: "#16a34a", textAlign: "center", marginBottom: "10px" }}>{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!useOtp && (
          <>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

            {isRegister && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
          </>
        )}

        {!isRegister && useOtp && otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button type="submit">
          {isRegister
            ? "Create account"
            : useOtp
            ? otpSent
              ? "Verify OTP & Sign in"
              : "Send OTP"
            : "Sign in"}
        </button>
      </form>

      {!isRegister && (
        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#6b7280" }}>
          {useOtp ? "Remember your password? " : "Forgot your password? "}
          <button
            type="button"
            onClick={() => {
              setUseOtp(!useOtp);
              setOtp("");
              setOtpSent(false);
              setError("");
              setSuccess("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {useOtp ? "Use password instead" : "Use OTP login"}
          </button>
        </p>
      )}

      <p style={{ textAlign: "center", marginTop: "10px", fontSize: "13px", color: "#6b7280" }}>
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setUseOtp(false);
            setOtp("");
            setOtpSent(false);
            setError("");
            setSuccess("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          {isRegister ? "Sign in" : "Create one"}
        </button>
      </p>
    </div>
  );
}

export default Login;
