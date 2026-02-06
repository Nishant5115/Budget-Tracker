import { useEffect, useState } from "react";
import {
  getCategorySummary,
  getMonthlySummary,getSummary
} from "./services/transactionServices";
import CategoryPieChart from "./charts/CategoryPieChart";
import MonthlyLineChart from "./charts/MonthlyLineChart";
import { getBudgetSummary } from "./services/budgetService";
import BudgetStatus from "./components/BudgetStatus";
import SummaryCard from "./components/SummaryCard";



function App() {
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
const [budgetData, setBudgetData] = useState(null);
const [summary, setSummary] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    const category = await getCategorySummary();
    const monthly = await getMonthlySummary();
    const budget = await getBudgetSummary(2, 2026);
    const summaryData = await getSummary();

    setCategoryData(category);
    setMonthlyData(monthly);
    setBudgetData(budget);
    setSummary(summaryData);
  };

  fetchData();
}, []);




  return (
    <div style={{ padding: "20px" }}>
      <h1>Budget Tracker Dashboard</h1>

      <CategoryPieChart data={categoryData} />
      <MonthlyLineChart data={monthlyData} />
      <BudgetStatus data={budgetData} />
     {summary && (
  <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
    <SummaryCard title="Income" amount={summary.totalIncome} />
    <SummaryCard title="Expense" amount={summary.totalExpense} />
    <SummaryCard title="Balance" amount={summary.balance} />
  </div>
)}
    </div>
  );
}

export default App;
