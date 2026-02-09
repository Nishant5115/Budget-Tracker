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
     {budgetData && (
  <div className="summary-grid">
    <SummaryCard
      title="Monthly Budget"
      amount={budgetData.budget}
      variant="budget"
    />

    <SummaryCard
      title="Total Spent"
      amount={budgetData.spent}
      variant="expense"
    />

    <SummaryCard
      title="Remaining"
      amount={budgetData.remaining}
      variant={budgetData.remaining >= 0 ? "success" : "danger"}
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
