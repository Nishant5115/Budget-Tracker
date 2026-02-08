import { useEffect, useState } from "react";
import "./App.css";

// Services
import {
  getCategorySummary,
  getMonthlySummary,
  getSummary,
} from "./services/transactionServices";
import { getBudgetSummary } from "./services/budgetService";

// Components
import CategoryPieChart from "./charts/CategoryPieChart";
import MonthlyLineChart from "./charts/MonthlyLineChart";
import SummaryCard from "./components/SummaryCard";
import BudgetStatus from "./components/BudgetStatus";
import AddTransaction from "./components/AddTransaction";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

// Pages
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // 🔐 Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 📊 Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const category = await getCategorySummary();
      const monthly = await getMonthlySummary();
      const summaryData = await getSummary();

      setCategoryData(category);
      setMonthlyData(monthly);
      setSummary(summaryData);
    } catch (error) {
      console.error("Transaction dashboard fetch failed", error);
    }

    // 👉 Handle budget separately
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const budget = await getBudgetSummary(month, year);
      setBudgetData(budget);
    } catch (error) {
      if (error.response?.status === 404) {
        // No budget set → valid state
        setBudgetData(null);
      } else {
        console.error("Budget fetch failed", error);
      }
    }
  };

  // Fetch dashboard after login
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // 🔐 Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 📊 DASHBOARD UI
  return (
  <div className="app">
    {/* Header */}
    <div className="header">
      <div>
        <h1 className="title">Budget Tracker</h1>
        <p className="subtitle">
          Track your expenses, budgets, and savings at a glance
        </p>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>

    <div style={{ marginBottom: "20px" }}>
  <button onClick={() => setCurrentPage("dashboard")}>
    Dashboard
  </button>
  <button onClick={() => setCurrentPage("transactions")}>
    Transactions
  </button>
</div>

    
    {currentPage === "dashboard" && (
  <Dashboard
    summary={summary}
    categoryData={categoryData}
    monthlyData={monthlyData}
    budgetData={budgetData}
  />
)}

{currentPage === "transactions" && (
  <Transactions onTransactionAdded={fetchDashboardData} />
)}

  </div>
);
}

export default App;
