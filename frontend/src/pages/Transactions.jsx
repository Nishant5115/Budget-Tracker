import AddTransaction from "../components/AddTransaction";

function Transactions({ onTransactionAdded }) {
  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Transactions</h2>

      <AddTransaction onSuccess={onTransactionAdded} />
    </div>
  );
}

export default Transactions;
