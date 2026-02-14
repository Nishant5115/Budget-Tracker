import { useState, useEffect } from "react";
import {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal,
} from "../services/savingsGoalService";
import { useNotification } from "../contexts/NotificationContext";
import ConfirmationDialog from "../components/ConfirmationDialog";

function SavingsGoals() {
  const { showSuccess, showError } = useNotification();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [showAddAmountModal, setShowAddAmountModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [addAmount, setAddAmount] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (err) {
      showError("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showError("Target date cannot be in the past. Please select a future date.");
        return;
      }

      const submitData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
      };
      if (editingGoal) {
        await updateSavingsGoal(editingGoal._id, submitData);
        showSuccess("Savings goal updated successfully!");
      } else {
        await createSavingsGoal(submitData);
        showSuccess("Savings goal created successfully!");
      }
      setShowForm(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save savings goal");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSavingsGoal(goalToDelete);
      showSuccess("Savings goal deleted successfully!");
      setShowDeleteConfirmation(false);
      setGoalToDelete(null);
      fetchGoals();
    } catch (err) {
      showError("Failed to delete savings goal");
    }
  };

  const handleAddAmount = async () => {
    try {
      await addToSavingsGoal(selectedGoal._id, Number(addAmount));
      showSuccess("Amount added to savings goal!");
      setShowAddAmountModal(false);
      setSelectedGoal(null);
      setAddAmount("");
      fetchGoals();
    } catch (err) {
      showError("Failed to add amount");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      targetAmount: "",
      targetDate: "",
      description: "",
      category: "General",
    });
  };

  const openEditForm = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : "",
      description: goal.description || "",
      category: goal.category || "General",
    });
    setShowForm(true);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Savings Goals</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingGoal(null);
            setShowForm(true);
          }}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          + New Goal
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3>{editingGoal ? "Edit Goal" : "Create Savings Goal"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  min="0.01"
                  step="0.01"
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  min={getTodayDate()}
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={{ flex: 1, padding: "10px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                {editingGoal ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingGoal(null); resetForm(); }} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#6b7280" }}>No savings goals yet. Create your first goal!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {goals.map((goal) => {
            const progress = goal.progress || 0;
            const remaining = goal.remainingAmount || 0;
            return (
              <div key={goal._id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{goal.title}</h3>
                    <p style={{ margin: "0 0 4px 0", color: "#6b7280", fontSize: "14px" }}>{goal.description}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                      Target: ₹{goal.targetAmount.toLocaleString()} • Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {!goal.isCompleted && (
                      <button onClick={() => { setSelectedGoal(goal); setShowAddAmountModal(true); }} style={{ padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                        Add
                      </button>
                    )}
                    <button onClick={() => openEditForm(goal)} style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Edit
                    </button>
                    <button onClick={() => { setGoalToDelete(goal._id); setShowDeleteConfirmation(true); }} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span>Progress: ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                    <span style={{ fontWeight: 600 }}>{progress.toFixed(1)}%</span>
                  </div>
                  <div style={{ width: "100%", height: "12px", background: "#e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: goal.isCompleted ? "#10b981" : "#3b82f6", transition: "width 0.3s" }} />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  Remaining: ₹{remaining.toLocaleString()} {goal.isCompleted && "✅ Completed!"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Delete Savings Goal?"
        message="Are you sure you want to delete this savings goal? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => { setShowDeleteConfirmation(false); setGoalToDelete(null); }}
        type="danger"
      />

      {showAddAmountModal && selectedGoal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", maxWidth: "400px", width: "90%" }}>
            {selectedGoal.isCompleted ? (
              <>
                <h3 style={{ marginTop: 0, color: "#10b981" }}>🎉 Savings Successful!</h3>
                <p style={{ marginBottom: "16px", color: "#6b7280" }}>
                  You have successfully reached your savings goal of ₹{selectedGoal.targetAmount.toLocaleString()} for "{selectedGoal.title}".
                </p>
                <button onClick={() => { setShowAddAmountModal(false); setSelectedGoal(null); setAddAmount(""); }} style={{ width: "100%", padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>Add Amount to Goal</h3>
                <p style={{ marginBottom: "16px", color: "#6b7280" }}>{selectedGoal.title}</p>
                <input
                  type="number"
                  placeholder="Amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  style={{ width: "100%", padding: "10px", marginBottom: "16px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={handleAddAmount} style={{ flex: 1, padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    Add
                  </button>
                  <button onClick={() => { setShowAddAmountModal(false); setSelectedGoal(null); setAddAmount(""); }} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SavingsGoals;

