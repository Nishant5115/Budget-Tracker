function SummaryCard({ title, amount }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
      }}
    >
      <h3>{title}</h3>
      <h2>₹{amount}</h2>
    </div>
  );
}

export default SummaryCard;
