function BudgetStatus({ data }) {
  if (!data) return null;

  const isOk = data.status === "within budget";

  return (
    <div className="budget-box">
      <div className="budget-row">
        <span>Budget</span>
        <strong>₹{data.budget}</strong>
      </div>

      <div className="budget-row">
        <span>Spent</span>
        <strong>₹{data.spent}</strong>
      </div>

      <div className="budget-row">
        <span>Remaining</span>
        <strong>₹{data.remaining}</strong>
      </div>

      <div className={`budget-status ${isOk ? "ok" : "bad"}`}>
        {isOk ? "Within Budget" : "Overspent"}
      </div>
    </div>
  );
}

export default BudgetStatus;
