import CategoryPieChart from "../charts/CategoryPieChart";
import MonthlyLineChart from "../charts/MonthlyLineChart";
import SummaryCard from "../components/SummaryCard";
import BudgetStatus from "../components/BudgetStatus";
import BudgetAlerts from "../components/BudgetAlerts";
import { downloadMonthlyReport } from "../services/reportService";

function Dashboard({
  summary,
  categoryData,
  monthlyData,
  budgetData,
  filterMonth,
  filterYear,
  onFilterChange,
}) {
  const handleDownloadReport = async () => {
    try {
      await downloadMonthlyReport(filterMonth, filterYear);
    } catch (err) {
      console.error("Report download failed", err);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div>
      {/* Budget alerts */}
      <BudgetAlerts data={budgetData} />

      {/* Report toolbar */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select
          value={filterMonth}
          onChange={(e) =>
            onFilterChange(Number(e.target.value), filterYear)
          }
          style={{
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 12,
          }}
        >
          {Array.from({ length: 12 }).map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {new Date(0, idx).toLocaleString("default", { month: "short" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={filterYear}
          onChange={(e) =>
            onFilterChange(filterMonth, Number(e.target.value))
          }
          style={{
            width: 80,
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 12,
          }}
        />

        <button
          onClick={handleDownloadReport}
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            border: "none",
            background: "#6366f1",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>

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
