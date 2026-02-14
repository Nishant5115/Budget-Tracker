import { useState } from "react";
import { loginUser, registerUser, sendOtp, verifyOtp } from "../services/authService";
import { useNotification } from "../contexts/NotificationContext";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const { showSuccess, showError } = useNotification();
  const [isRegister, setIsRegister] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          showError("Passwords do not match");
          return;
        }

        if (password.length < 8) {
          showError("Password must be at least 8 characters long");
          return;
        }

        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
          showError(
            "Password must contain at least one uppercase letter and one number"
          );
          return;
        }

        await registerUser({ name, email, password });
        showSuccess("Registration successful! Please sign in.");
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
              showSuccess("OTP sent to your email successfully!");
            } catch (err) {
              const errorMsg = err.response?.data?.message || err.message || "Failed to send OTP";
              if (errorMsg.toLowerCase().includes("expired") || errorMsg.toLowerCase().includes("invalid")) {
                showError(errorMsg);
              } else {
                showError("Failed to send OTP. Please try again.");
              }
            }
          } else {
            try {
              const data = await verifyOtp({ email, otp });
              localStorage.setItem("token", data.token);
              if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
              }
              showSuccess("OTP verified successfully! Logging in...");
              setTimeout(() => {
                onLoginSuccess();
              }, 500);
            } catch (err) {
              const errorMsg = err.response?.data?.message || err.message || "OTP verification failed";
              if (errorMsg.toLowerCase().includes("expired")) {
                showError("OTP has expired. Please request a new one.");
              } else if (errorMsg.toLowerCase().includes("incorrect") || errorMsg.toLowerCase().includes("invalid")) {
                showError("Invalid OTP. Please check and try again.");
              } else {
                showError(errorMsg);
              }
            }
          }
        } else {
          const data = await loginUser({ email, password });
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          showSuccess("Login successful! Welcome back.");
          setTimeout(() => {
            onLoginSuccess();
          }, 500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (isRegister ? "Registration failed" : "Login failed");
      if (errorMsg.toLowerCase().includes("invalid credentials")) {
        showError("Invalid email or password. Please try again.");
      } else if (errorMsg.toLowerCase().includes("unauthorized")) {
        showError("Unauthorized access. Please check your credentials.");
      } else {
        showError(errorMsg);
      }
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
