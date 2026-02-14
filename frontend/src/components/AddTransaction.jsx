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
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

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
        type,
        description,
      });

      // clear form
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split('T')[0]);
      setType("expense");
      setDescription("");
      setShowForm(false);

      showSuccess(`${type === "expense" ? "Expense" : "Income"} added successfully!`);
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
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
        }}>
          <h3 style={{ marginTop: 0 }}>Add Transaction</h3>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
            />

            <input
              type="text"
              placeholder="Category (Food, Rent, Travel, Salary...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()}
              required
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit">Add Transaction</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddTransaction;
