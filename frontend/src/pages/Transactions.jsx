import { useState, useEffect, useMemo } from "react";
import AddTransaction from "../components/AddTransaction";
import API from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { useNotification } from "../contexts/NotificationContext";

function Transactions({ onTransactionAdded }) {
  const { showSuccess, showError } = useNotification();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filterType !== "all") params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      if (filterFrom) params.from = filterFrom;
      if (filterTo) params.to = filterTo;

      const res = await API.get("/transactions", { params });
      setTransactions(res.data);
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (id) => {
    setTransactionToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    try {
      await API.delete(`/transactions/${transactionToDelete}`);
      showSuccess("Transaction deleted successfully!");
      setShowDeleteConfirmation(false);
      setTransactionToDelete(null);
      fetchTransactions();
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete transaction";
      showError(errorMsg);
      setShowDeleteConfirmation(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setTransactionToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const analytics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else if (t.type === "expense") {
        totalExpense += t.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Transactions</h2>

      

     

      <AddTransaction
        onSuccess={() => {
          fetchTransactions();
          if (onTransactionAdded) onTransactionAdded();
        }}
      />

      {error && <p className="error" style={{ marginTop: "16px" }}>{error}</p>}

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      <div style={{ marginTop: "32px" }}>
        <h3>Transaction History</h3>
        {/* Filters */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 10,
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 8px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Category
          </label>
          <input
            type="text"
            placeholder="Search category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 8px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            From
          </label>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 8px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            To
          </label>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 8px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={fetchTransactions}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {loading ? "Applying..." : "Apply filters"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterType("all");
              setFilterCategory("");
              setFilterFrom("");
              setFilterTo("");
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "none",
              background: "#e5e7eb",
              color: "#111827",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
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
                        onClick={() => handleDeleteClick(transaction._id)}
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
