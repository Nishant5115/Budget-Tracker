import { useState } from "react";
import API from "../services/api";
import { useNotification } from "../contexts/NotificationContext";
import "./AddTransaction.css";

function AddTransaction({ onSuccess }) {
  const { showSuccess, showError } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const categories = [
    "Food & Dining",
    "Groceries",
    "Transportation",
    "Rent",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Education",
    "Bills",
    "Travel",
    "Personal Care",
    "Subscriptions",
    "Other"
  ];

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate that date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      const errorMsg = "Cannot add transactions for past dates. Please select today or a future date.";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    try {
      await API.post("/transactions", {
        amount: Number(amount),
        category,
        date: date || new Date().toISOString(),
        type: "expense",
        description,
      });

      // clear form
      setAmount("");
      setCategory("");
      setCustomCategory("");
      setDate(new Date().toISOString().split('T')[0]);
      setDescription("");
      setShowForm(false);

      showSuccess("Expense added successfully!");
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add transaction";
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  return (
    <div className="add-transaction">
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 16px",
          backgroundColor: showForm ? "#ef4444" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "12px",
        }}
      >
        {showForm ? "Hide Form" : "+ Add Transaction"}
      </button>

      {showForm && (
        <div style={{
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          animation: "slideDown 0.3s ease-out",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#111827" }}>
              💸 Add Expense
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#6b7280",
                padding: "0",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
              }}
            >
              ×
            </button>
          </div>

          {error && (
            <div style={{
              padding: "12px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#991b1b",
              marginBottom: "16px",
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                Category
              </label>
              <select
                value={category === "Other" || !categories.includes(category) ? "Other" : category}
                onChange={(e) => {
                  if (e.target.value === "Other") {
                    setCategory("");
                    setCustomCategory("");
                  } else {
                    setCategory(e.target.value);
                    setCustomCategory("");
                  }
                }}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  background: "white",
                  cursor: "pointer",
                  marginBottom: category === "Other" || (!categories.includes(category) && category) ? "8px" : "0",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {(category === "Other" || (!categories.includes(category) && category)) && (
                <input
                  type="text"
                  placeholder="Enter custom category..."
                  value={customCategory || category}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    setCategory(e.target.value);
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayDate()}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="Add a note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "8px",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              ➖ Add Expense
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AddTransaction;
