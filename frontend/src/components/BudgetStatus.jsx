function BudgetStatus({ data }) {
  if (!data) {
    return (
      <div className="budget-box">
        <p>No budget set for this month. Set a budget to track your spending!</p>
      </div>
    );
  }

  const isOk = data.status === "within budget";

  return (
    <div className="budget-box">
      

      <div className={`budget-status ${isOk ? "ok" : "bad"}`}>
        {isOk ? "✅ Within Budget" : "❌ Overspent"}
      </div>
    </div>
  );
}

export default BudgetStatus;
