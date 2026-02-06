function BudgetStatus({ data }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ddd" }}>
      <h2>Budget Status</h2>
      <p>Budget: ₹{data.budget}</p>
      <p>Spent: ₹{data.spent}</p>
      <p>Remaining: ₹{data.remaining}</p>
      <p>Status: {data.status}</p>
    </div>
  );
}

export default BudgetStatus;
