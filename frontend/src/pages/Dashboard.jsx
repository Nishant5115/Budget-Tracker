import CategoryPieChart from "../charts/CategoryPieChart";
import MonthlyLineChart from "../charts/MonthlyLineChart";
import SummaryCard from "../components/SummaryCard";
import BudgetStatus from "../components/BudgetStatus";

function Dashboard({
  summary,
  categoryData,
  monthlyData,
  budgetData,
}) {
  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div className="summary-grid">
          <SummaryCard
            title="Total Income"
            amount={summary.totalIncome}
            variant="income"
          />
          <SummaryCard
            title="Total Expenses"
            amount={summary.totalExpense}
            variant="expense"
          />
          <SummaryCard
            title="Net Savings"
            amount={summary.balance}
            variant="balance"
          />
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <h3>Category-wise Expenses</h3>
          <CategoryPieChart data={categoryData} />
        </div>

        <div className="card">
          <h3>Monthly Expense Trend</h3>
          <MonthlyLineChart data={monthlyData} />
        </div>
      </div>

      {/* Budget */}
      <div className="card">
        <h3>Budget Status</h3>
        <BudgetStatus data={budgetData} />
      </div>
    </div>
  );
}

export default Dashboard;
