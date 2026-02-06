import { useEffect, useState } from "react";
import "./App.css";

import {
  getCategorySummary,
  getMonthlySummary,
  getSummary,
} from "./services/transactionServices";
import { getBudgetSummary } from "./services/budgetService";

import CategoryPieChart from "./charts/CategoryPieChart";
import MonthlyLineChart from "./charts/MonthlyLineChart";
import SummaryCard from "./components/SummaryCard";
import BudgetStatus from "./components/BudgetStatus";

function App() {
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const category = await getCategorySummary();
      const monthly = await getMonthlySummary();
      const summaryData = await getSummary();
      const budget = await getBudgetSummary(2, 2026); // test month/year

      setCategoryData(category);
      setMonthlyData(monthly);
      setSummary(summaryData);
      setBudgetData(budget);
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1 className="title">Budget Tracker</h1>
        <p className="subtitle">
          Track your expenses, budgets, and savings at a glance
        </p>
      </div>

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

export default App;
