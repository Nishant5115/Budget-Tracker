import React from "react";

function BudgetAlerts({ data }) {
  if (!data || typeof data.budget !== "number") return null;

  const { budget, spent, remaining } = data;
  const used = budget > 0 ? (spent / budget) * 100 : 0;

  let message = "";
  let tone = "ok";

  if (used >= 100) {
    message = "You have exceeded this month’s budget. Review your expenses.";
    tone = "danger";
  } else if (used >= 90) {
    message =
      "You’ve used more than 90% of your budget. Consider pausing non‑essential spending.";
    tone = "danger";
  } else if (used >= 75) {
    message =
      "You’ve used more than 75% of your budget. Keep an eye on your remaining balance.";
    tone = "warn";
  } else {
    message = "You’re currently within your budget for this month.";
    tone = "ok";
  }

  const bg =
    tone === "danger" ? "#fef2f2" : tone === "warn" ? "#fffbeb" : "#ecfdf3";
  const border =
    tone === "danger" ? "#fecaca" : tone === "warn" ? "#facc15" : "#bbf7d0";
  const color =
    tone === "danger" ? "#b91c1c" : tone === "warn" ? "#854d0e" : "#166534";

  return (
    <div
      style={{
        marginBottom: 16,
        padding: "10px 14px",
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 13,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div>
        <strong style={{ marginRight: 6 }}>Budget alert</strong>
        <span>{message}</span>
      </div>
      <span style={{ fontWeight: 500 }}>
        {used.toFixed(0)}% used • ₹{remaining.toLocaleString()} left
      </span>
    </div>
  );
}

export default BudgetAlerts;









