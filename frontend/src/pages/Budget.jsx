import { useState } from "react";
import { setBudget, getBudgetSummary } from "../services/budgetService";

function Budget({ onBudgetUpdated }) {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setError("");

    try {
      
      await setBudget({
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
      });

      const data = await getBudgetSummary(month, year);
      setSummary(data);

      if (onBudgetUpdated) onBudgetUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set budget");
    }
  };

  return (
    <div className="card">
      <h2>Monthly Budget</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSetBudget} style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Month
            </label>
            <input
              type="number"
              placeholder="Month (1-12)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Year
            </label>
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2020"
              max="2100"
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
            Budget Amount (₹)
          </label>
          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500"
          }}
        >
          Set Budget
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "16px", padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
          <p>
            <b>Budget:</b> ₹{summary.budget?.toLocaleString() || 0}
          </p>
          <p>
            <b>Spent:</b> ₹{summary.spent?.toLocaleString() || 0}
          </p>
          <p>
            <b>Remaining:</b> ₹{summary.remaining?.toLocaleString() || 0}
          </p>
          <p>
            <b>Status:</b>{" "}
            {summary.status === "within budget"
              ? "✅ Within Budget"
              : "❌ Overspent"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Budget;
