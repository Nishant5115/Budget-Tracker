import { useState } from "react";
import API from "../services/api";
import "./AddTransaction.css";

function AddTransaction({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("AddTransaction submit clicked");

    setError("");

    try {
      await API.post("/transactions", {
        amount: Number(amount),
        type,
        category,
        date,
      });

      // clear form
      setAmount("");
      setCategory("");
      setDate("");

      // tell parent to refresh dashboard
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="add-transaction">
      <h3>Add Transaction</h3>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          placeholder="Category (Food, Rent, Salary...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddTransaction;
