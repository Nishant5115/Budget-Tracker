import { useState, useEffect } from "react";
import AddTransaction from "../components/AddTransaction";
import API from "../services/api";

function Transactions({ onTransactionAdded }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Transactions</h2>

      <AddTransaction onSuccess={() => { fetchTransactions(); if (onTransactionAdded) onTransactionAdded(); }} />

      {error && <p className="error" style={{ marginTop: "16px" }}>{error}</p>}

      <div style={{ marginTop: "32px" }}>
        <h3>Transaction History</h3>
        
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Amount</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{formatDate(transaction.date)}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: transaction.type === "income" ? "#d4edda" : "#f8d7da",
                          color: transaction.type === "income" ? "#155724" : "#721c24",
                        }}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{transaction.category}</td>
                    <td style={{ padding: "12px" }}>{transaction.description || "-"}</td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: "bold",
                        color: transaction.type === "income" ? "green" : "red",
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
