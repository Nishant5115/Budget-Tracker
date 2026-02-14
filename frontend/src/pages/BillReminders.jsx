import { useState, useEffect } from "react";
import {
  createBillReminder,
  getBillReminders,
  updateBillReminder,
  deleteBillReminder,
  markBillAsPaid,
} from "../services/billReminderService";
import { useNotification } from "../contexts/NotificationContext";
import ConfirmationDialog from "../components/ConfirmationDialog";

function BillReminders() {
  const { showSuccess, showError } = useNotification();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "Bills",
    description: "",
    isRecurring: false,
    recurringFrequency: "monthly",
    reminderDaysBefore: 3,
  });

  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const quickAddTemplates = [
    { title: "Electricity Bill", category: "Utilities", isRecurring: true },
    { title: "Water Bill", category: "Utilities", isRecurring: true },
    { title: "Internet Bill", category: "Bills", isRecurring: true },
    { title: "Phone Bill", category: "Bills", isRecurring: true },
    { title: "Rent", category: "Rent", isRecurring: true },
    { title: "Credit Card Payment", category: "Bills", isRecurring: true },
    { title: "Insurance Premium", category: "Healthcare", isRecurring: true },
    { title: "Subscription", category: "Subscriptions", isRecurring: true },
  ];

  const billCategories = [
    "Bills",
    "Utilities",
    "Rent",
    "Insurance",
    "Subscriptions",
    "Loan Payment",
    "Credit Card",
    "Other"
  ];

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQuickAdd && !event.target.closest('[data-quick-add]')) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuickAdd]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await getBillReminders();
      setReminders(data);
    } catch (err) {
      showError("Failed to load bill reminders");
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
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showError("Due date cannot be in the past. Please select a future date.");
        return;
      }

      const submitData = {
        ...formData,
        amount: Number(formData.amount),
        reminderDaysBefore: Number(formData.reminderDaysBefore),
      };
      if (editingReminder) {
        await updateBillReminder(editingReminder._id, submitData);
        showSuccess("Bill reminder updated successfully!");
      } else {
        await createBillReminder(submitData);
        showSuccess("Bill reminder created successfully!");
      }
      setShowForm(false);
      setEditingReminder(null);
      resetForm();
      fetchReminders();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save bill reminder");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBillReminder(reminderToDelete);
      showSuccess("Bill reminder deleted successfully!");
      setShowDeleteConfirmation(false);
      setReminderToDelete(null);
      fetchReminders();
    } catch (err) {
      showError("Failed to delete bill reminder");
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await markBillAsPaid(id);
      showSuccess("Bill marked as paid!");
      fetchReminders();
    } catch (err) {
      showError("Failed to mark bill as paid");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      dueDate: "",
      category: "Bills",
      description: "",
      isRecurring: false,
      recurringFrequency: "monthly",
      reminderDaysBefore: 3,
    });
  };

  const openEditForm = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      amount: reminder.amount,
      dueDate: reminder.dueDate ? new Date(reminder.dueDate).toISOString().split('T')[0] : "",
      category: reminder.category || "Bills",
      description: reminder.description || "",
      isRecurring: reminder.isRecurring || false,
      recurringFrequency: reminder.recurringFrequency || "monthly",
      reminderDaysBefore: reminder.reminderDaysBefore || 3,
    });
    setShowForm(true);
  };

  const getStatusColor = (reminder) => {
    if (reminder.isPaid) return "#10b981";
    if (reminder.isOverdue) return "#ef4444";
    if (reminder.daysUntilDue <= 3) return "#f59e0b";
    return "#3b82f6";
  };

  const getStatusText = (reminder) => {
    if (reminder.isPaid) return "Paid";
    if (reminder.isOverdue) return "Overdue";
    if (reminder.daysUntilDue === 0) return "Due Today";
    if (reminder.daysUntilDue === 1) return "Due Tomorrow";
    if (reminder.daysUntilDue < 0) return `${Math.abs(reminder.daysUntilDue)} days overdue`;
    return `${reminder.daysUntilDue} days left`;
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Bill Reminders</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }} data-quick-add>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
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
              ⚡ Quick Add
            </button>
            {showQuickAdd && (
              <div data-quick-add style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                zIndex: 100,
                minWidth: "200px",
                maxHeight: "300px",
                overflowY: "auto",
              }}>
                {quickAddTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
                      setFormData({
                        ...formData,
                        title: template.title,
                        category: template.category,
                        isRecurring: template.isRecurring,
                        dueDate: nextMonth.toISOString().split('T')[0],
                      });
                      setShowQuickAdd(false);
                      setShowForm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      borderBottom: idx < quickAddTemplates.length - 1 ? "1px solid #e5e7eb" : "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#111827",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f3f4f6"}
                    onMouseLeave={(e) => e.target.style.background = "none"}
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingReminder(null);
              setShowForm(true);
            }}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            + New Reminder
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3>{editingReminder ? "Edit Reminder" : "Create Bill Reminder"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                Bill Title
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
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0.01"
                  step="0.01"
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={getTodayDate()}
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", background: "white", cursor: "pointer" }}
              >
                {billCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                />
                Recurring Bill
              </label>
            </div>
            {formData.isRecurring && (
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
                Remind me (days before)
              </label>
              <input
                type="number"
                value={formData.reminderDaysBefore}
                onChange={(e) => setFormData({ ...formData, reminderDaysBefore: Number(e.target.value) })}
                min="0"
                max="30"
                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
              />
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
                {editingReminder ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingReminder(null); resetForm(); }} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#6b7280" }}>No bill reminders yet. Create your first reminder!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {reminders.map((reminder) => (
            <div key={reminder._id} className="card" style={{ borderLeft: `4px solid ${getStatusColor(reminder)}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>{reminder.title}</h3>
                    {reminder.isRecurring && <span style={{ fontSize: "12px", padding: "2px 8px", background: "#dbeafe", color: "#1e40af", borderRadius: "4px" }}>Recurring</span>}
                  </div>
                  <p style={{ margin: "0 0 4px 0", color: "#6b7280", fontSize: "14px" }}>{reminder.description}</p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                    ₹{reminder.amount.toLocaleString()} • Due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {!reminder.isPaid && (
                    <button onClick={() => handleMarkAsPaid(reminder._id)} style={{ padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Mark Paid
                    </button>
                  )}
                  <button onClick={() => openEditForm(reminder)} style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                    Edit
                  </button>
                  <button onClick={() => { setReminderToDelete(reminder._id); setShowDeleteConfirmation(true); }} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ padding: "8px 12px", background: getStatusColor(reminder) + "20", borderRadius: "6px", display: "inline-block" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: getStatusColor(reminder) }}>
                  {getStatusText(reminder)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Delete Bill Reminder?"
        message="Are you sure you want to delete this bill reminder? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => { setShowDeleteConfirmation(false); setReminderToDelete(null); }}
        type="danger"
      />
    </div>
  );
}

export default BillReminders;

