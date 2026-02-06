function SummaryCard({ title, amount, variant }) {
  return (
    <div className={`summary-card ${variant}`}>
      <div className="summary-title">{title}</div>
      <div className="summary-amount">₹{amount}</div>
    </div>
  );
}

export default SummaryCard;
