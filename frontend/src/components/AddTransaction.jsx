import { useState } from "react";
import API from "../services/api";
import "./AddTransaction.css";

function AddTransaction({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
  );
}

export default AddTransaction;
