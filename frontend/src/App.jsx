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
import Profile from "./pages/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);

  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    }
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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">BT</div>
          <div className="sidebar-logo-text">Budget Tracker</div>
        </div>

        <div className="sidebar-section-label">Overview</div>
        <nav className="sidebar-nav">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
          >
            <span className="icon">📊</span>
            <span className="label">Dashboard</span>
          </button>
          <button
            className={currentPage === "budget" ? "active" : ""}
            onClick={() => setCurrentPage("budget")}
          >
            <span className="icon">💰</span>
            <span className="label">Budget</span>
          </button>
          <button
            className={currentPage === "transactions" ? "active" : ""}
            onClick={() => setCurrentPage("transactions")}
          >
            <span className="icon">📒</span>
            <span className="label">Transactions</span>
          </button>
        </nav>

        <div className="sidebar-section-label">Account</div>
        <nav className="sidebar-nav">
          <button
            className={currentPage === "profile" ? "active" : ""}
            onClick={() => setCurrentPage("profile")}
          >
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <small>© {new Date().getFullYear()} Budget Tracker</small>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <h1 className="title">Financial workspace</h1>
            <p className="subtitle">
              Monitor your cashflow, budgets and spending in one place.
            </p>
          </div>

          <div className="header-right">
            {currentUser && (
              <div className="user-pill">
                <span style={{ fontWeight: 500 }}>{currentUser.name}</span>
                <span style={{ margin: "0 6px" }}>•</span>
                <span style={{ fontSize: 12 }}>{currentUser.email}</span>
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="main-surface">
          <div className="main-content">
            {currentPage === "dashboard" && (
              <Dashboard
                summary={summary}
                categoryData={categoryData}
                monthlyData={monthlyData}
                budgetData={budgetData}
              />
            )}

            {currentPage === "budget" && (
              <Budget onBudgetUpdated={fetchDashboardData} />
            )}

            {currentPage === "transactions" && (
              <Transactions onTransactionAdded={fetchDashboardData} />
            )}

            {currentPage === "profile" && <Profile />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
