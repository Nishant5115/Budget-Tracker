import { useEffect, useState } from "react";
import { getCurrentUserProfile, updateCurrentUserProfile } from "../services/userService";
import SummaryCard from "../components/SummaryCard";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
    setSuccess("");

    try {
      const updated = await updateCurrentUserProfile({ name, email });
      setProfile((prev) => ({
        ...prev,
        name: updated.name,
        email: updated.email,
      }));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="card">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="card">{error}</div>;
  }

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
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
    <div className="card">
      <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {initials}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{profile?.name}</h2>
          <p style={{ margin: "4px 0", color: "#6b7280" }}>{profile?.email}</p>
          {joinedDate && (
            <p style={{ margin: 0, fontSize: 14, color: "#9ca3af" }}>
              Member since {joinedDate}
            </p>
          )}
        </div>
      </div>

      {/* Finance overview */}
      {profile?.stats && (
        <div className="summary-grid" style={{ marginBottom: 24 }}>
          <SummaryCard
            title="Total Income"
            amount={profile.stats.totalIncome}
            variant="success"
          />
          <SummaryCard
            title="Total Expenses"
            amount={profile.stats.totalExpense}
            variant="expense"
          />
          <SummaryCard
            title="Current Balance"
            amount={profile.stats.balance}
            variant={profile.stats.balance >= 0 ? "budget" : "danger"}
          />
        </div>
      )}

      {/* Profile form */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Profile Details</h3>

        {error && <p style={{ color: "#dc2626", marginBottom: 8 }}>{error}</p>}
        {success && (
          <p style={{ color: "#16a34a", marginBottom: 8 }}>{success}</p>
        )}

        <form
          onSubmit={handleUpdate}
          style={{ display: "grid", gap: 12, maxWidth: 480 }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #d1d5db",
                borderRadius: 6,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #d1d5db",
                borderRadius: 6,
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: 12,
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              width: "fit-content",
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;


