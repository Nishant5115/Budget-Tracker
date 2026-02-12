import { useState } from "react";
import { setBudget, checkBudgetExists, getBudgetSummary } from "../services/budgetService";
import BudgetAlerts from "../components/BudgetAlerts";

function Budget({ onBudgetUpdated }) {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBudgetData, setPendingBudgetData] = useState(null);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setError("");

    // Validate that the budget month/year is not in the past
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const selectedYear = Number(year);
    const selectedMonth = Number(month);

    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
      setError("Cannot set budget for past dates. Please select valid month and year.");
      return;
    }

    try {
      // Check if budget already exists for this month/year
      const existingBudget = await checkBudgetExists(month, year);

      if (existingBudget.exists) {
        // Show confirmation dialog
        setPendingBudgetData({
          month: Number(month),
          year: Number(year),
          amount: Number(amount),
        });
        setShowConfirmation(true);
      } else {
        // No existing budget, proceed directly
        await proceedWithBudgetUpdate({
          month: Number(month),
          year: Number(year),
          amount: Number(amount),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check budget");
    }
  };

  const proceedWithBudgetUpdate = async (budgetData) => {
    try {
      await setBudget(budgetData);

      const data = await getBudgetSummary(budgetData.month, budgetData.year);
      setSummary(data);

      if (onBudgetUpdated) onBudgetUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set budget");
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmation(false);
    if (pendingBudgetData) {
      await proceedWithBudgetUpdate(pendingBudgetData);
      setPendingBudgetData(null);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmation(false);
    setPendingBudgetData(null);
  };

  return (
    <div className="card">
      <h2>Monthly Budget</h2>

      <BudgetAlerts
        data={
          summary && {
            budget: summary.budget,
            spent: summary.spent,
            remaining: summary.remaining,
          }
        }
      />

      {error && <p className="error">{error}</p>}

      {showConfirmation && (
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
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            textAlign: "center",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#1f2937" }}>
              Update Existing Budget?
            </h3>
            <p style={{ marginBottom: "24px", color: "#6b7280" }}>
              A budget already exists for this month. Do you want to update it?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={handleCancelUpdate}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Update Budget
              </button>
            </div>
          </div>
        </div>
      )}

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
