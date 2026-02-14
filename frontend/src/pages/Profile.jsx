import { useEffect, useState } from "react";
import { getCurrentUserProfile, updateCurrentUserProfile, changePassword } from "../services/userService";
import { useNotification } from "../contexts/NotificationContext";

function Profile() {
  const { showSuccess, showError } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const updated = await updateCurrentUserProfile({ name, email });
      setProfile((prev) => ({
        ...prev,
        name: updated.name,
        email: updated.email,
      }));
      showSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update profile";
      showError(errorMsg);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    try {
      setPasswordLoading(true);
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      showSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to change password";
      setPasswordError(errorMsg);
      showError(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "20px", color: "#64748b" }}>Loading profile...</div>
      </div>
    );
  }

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        borderRadius: "16px",
        padding: "32px",
        color: "white",
        marginBottom: "24px",
        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>{profile?.name}</h1>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", opacity: 0.9 }}>{profile?.email}</p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>
            Member since <strong>{joinedDate}</strong>
          </p>
        </div>
        <div style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(255,255,255, 0.1) 0%, rgba(255,255,255, 0) 70%)",
          borderRadius: "50%",
        }}></div>
      </div>

      {/* Error messages for form validation */}
      {error && (
        <div style={{
          background: "#fee2e2",
          border: "1px solid #fecaca",
          color: "#991b1b",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {passwordError && (
        <div style={{
          background: "#fee2e2",
          border: "1px solid #fecaca",
          color: "#991b1b",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "13px",
        }}>
          {passwordError}
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: "grid", gap: "24px" }}>
        {/* Profile Details Card */}
        <div className="card" style={{ padding: "0" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: "8px 16px",
                background: isEditing ? "#ef4444" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              {isEditing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>

          <div style={{ padding: "20px" }}>
            {isEditing ? (
              <form onSubmit={handleUpdate} style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    marginTop: "8px",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0", fontWeight: 500 }}>
                    FULL NAME
                  </p>
                  <p style={{ fontSize: "15px", color: "#111827", margin: 0, fontWeight: 500 }}>
                    {profile?.name}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0", fontWeight: 500 }}>
                    EMAIL ADDRESS
                  </p>
                  <p style={{ fontSize: "15px", color: "#111827", margin: 0, fontWeight: 500 }}>
                    {profile?.email}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0", fontWeight: 500 }}>
                    MEMBER SINCE
                  </p>
                  <p style={{ fontSize: "15px", color: "#111827", margin: 0, fontWeight: 500 }}>
                    {joinedDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Security Card */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>Account Security</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {/* Password Change */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 2px 0", color: "#111827" }}>
                  🔒 Password
                </p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  Keep your account secure
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  color: "#3b82f6",
                  border: "1.5px solid #3b82f6",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>Account Statistics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{
              padding: "14px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 6px 0", fontWeight: 500 }}>
                ACCOUNT AGE
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#3b82f6", margin: 0 }}>
                {profile?.createdAt
                  ? Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))
                  : 0}{" "}
                Days
              </p>
            </div>

            <div style={{
              padding: "14px",
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(5, 150, 105, 0.08))",
              borderRadius: "8px",
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 6px 0", fontWeight: 500 }}>
                ACCOUNT STATUS
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#10b981", margin: 0 }}>
                ✓ Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "28px",
            borderRadius: "12px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            maxWidth: "420px",
            width: "90%",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#111827", fontSize: "18px", fontWeight: 600 }}>
              Change Password
            </h3>

            {passwordError && (
              <div style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "10px 12px",
                borderRadius: "6px",
                marginBottom: "14px",
                fontSize: "12px",
              }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: "10px 14px",
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    padding: "10px 14px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: passwordLoading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    fontSize: "13px",
                    opacity: passwordLoading ? 0.7 : 1,
                  }}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;


