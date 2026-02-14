import "./ConfirmationDialog.css";

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
}) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div
        className="confirmation-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`confirmation-icon confirmation-icon-${type}`}>
          {type === "warning" ? "⚠" : type === "danger" ? "⚠" : "ℹ"}
        </div>
        <h3 className="confirmation-title">{title}</h3>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button
            className="confirmation-button confirmation-button-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirmation-button confirmation-button-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;

