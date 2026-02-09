function SummaryCard({ title, amount, variant }) {
  const formattedAmount = amount !== null && amount !== undefined 
    ? amount.toLocaleString() 
    : "0";
  
  return (
    <div className={`summary-card ${variant}`}>
      <div className="summary-title">{title}</div>
      <div className="summary-amount">₹{formattedAmount}</div>
    </div>
  );
}

export default SummaryCard;
