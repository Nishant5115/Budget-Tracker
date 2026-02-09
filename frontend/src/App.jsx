import { useEffect, useState } from "react";
import "./App.css";

// Services
import {
  getCategorySummary,
  getMonthlySummary,
  getSummary,
} from "./services/transactionServices";
import { getBudgetSummary } from "./services/budgetService";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const category = await getCategorySummary();
      const monthly = await getMonthlySummary();
      const summaryData = await getSummary();

      setCategoryData(category);
      setMonthlyData(monthly);
      setSummary(summaryData);
    } catch (err) {
      console.error("Dashboard data failed", err);
    }

    try {
      const now = new Date();
      const budget = await getBudgetSummary(
        now.getMonth() + 1,
        now.getFullYear()
      );
      setBudgetData(budget);
    } catch (err) {
      setBudgetData(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);


  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div>
          <h1 className="title">Budget Tracker</h1>
          <p className="subtitle">
            Track your expenses against a monthly budget
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Navigation */}
      <div className="nav">
        <button 
          className={currentPage === "budget" ? "active" : ""}
          onClick={() => setCurrentPage("budget")}
        >
          Budget
        </button>
        <button 
          className={currentPage === "transactions" ? "active" : ""}
          onClick={() => setCurrentPage("transactions")}
        >
          Expenses
        </button>
        <button 
          className={currentPage === "dashboard" ? "active" : ""}
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </button>
      </div>

      {/* Pages */}
      {currentPage === "budget" && (
        <Budget onBudgetUpdated={fetchDashboardData} />
      )}

      {currentPage === "transactions" && (
        <Transactions onTransactionAdded={fetchDashboardData} />
      )}

      {currentPage === "dashboard" && (
        <Dashboard
          summary={summary}
          categoryData={categoryData}
          monthlyData={monthlyData}
          budgetData={budgetData}
        />
      )}
    </div>
  );
}

export default App;
