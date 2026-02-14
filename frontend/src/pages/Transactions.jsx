import { useState, useEffect, useMemo } from "react";
import AddTransaction from "../components/AddTransaction";
import EditTransactionForm from "../components/EditTransactionForm";
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
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = { type: "expense" };
      if (filterCategory) params.category = filterCategory;
      if (filterFrom) params.from = filterFrom;
      if (filterTo) params.to = filterTo;

      const res = await API.get("/transactions", { params });
      let filtered = res.data;
      
      // Apply search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.category?.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query) ||
            t.amount?.toString().includes(query)
        );
      }
      
      setTransactions(filtered);
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
  }, [searchQuery]);

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

  const handleEdit = (transaction) => {
    setEditingTransaction({ ...transaction });
  };

  const handleUpdateTransaction = async (updatedData) => {
    try {
      await API.put(`/transactions/${editingTransaction._id}`, updatedData);
      showSuccess("Transaction updated successfully!");
      setEditingTransaction(null);
      fetchTransactions();
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update transaction";
      showError(errorMsg);
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

  const analytics = useMemo(() => {
    let totalExpense = 0;

    transactions.forEach((t) => {
      totalExpense += t.amount;
    });

    return {
      totalExpense,
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

      {/* Search Bar */}
      <div style={{ marginTop: "20px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="🔍 Search transactions by category, description, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

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

      {/* Edit Transaction Modal */}
      {editingTransaction && (
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
            padding: "28px",
            borderRadius: "12px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#111827", fontSize: "20px", fontWeight: 600 }}>
              Edit Transaction
            </h3>
            <EditTransactionForm
              transaction={editingTransaction}
              onSave={handleUpdateTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}

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
                    <td style={{ padding: "12px" }}>{transaction.category}</td>
                    <td style={{ padding: "12px" }}>{transaction.description || "-"}</td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "red",
                      }}
                    >
                      -₹{transaction.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleEdit(transaction)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(transaction._id)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
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
