import { useState, useEffect } from "react";

function EditTransactionForm({ transaction, onSave, onCancel }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
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

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount || "");
      const transCategory = transaction.category || "";
      setCategory(transCategory);
      if (transCategory && !categories.includes(transCategory)) {
        setCustomCategory(transCategory);
      } else {
        setCustomCategory("");
      }
      setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : "");
      setDescription(transaction.description || "");
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      amount: Number(amount),
      category,
      date: date || new Date().toISOString(),
      type: "expense",
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0.01"
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
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
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
            padding: "10px 12px",
            border: "1.5px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
            boxSizing: "border-box",
            background: "white",
            cursor: "pointer",
            marginBottom: category === "Other" || (!categories.includes(category) && category) ? "8px" : "0",
          }}
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
              padding: "10px 12px",
              border: "1.5px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        )}
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "#e5e7eb",
            color: "#374151",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditTransactionForm;

