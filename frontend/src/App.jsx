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
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import SavingsGoals from "./pages/SavingsGoals";
import BillReminders from "./pages/BillReminders";

// Components
import ConfirmationDialog from "./components/ConfirmationDialog";
import { useNotification } from "./contexts/NotificationContext";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { showSuccess } = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [summary, setSummary] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUser(null);
    showSuccess("Logged out successfully!");
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
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

  const fetchDashboardData = async (month = filterMonth, year = filterYear) => {
    try {
      const category = await getCategorySummary(month, year);
      const monthly = await getMonthlySummary();
      const summaryData = await getSummary(month, year);

      setCategoryData(category);
      setMonthlyData(monthly);
      setSummary(summaryData);
    } catch (err) {
      console.error("Dashboard data failed", err);
    }

    try {
      const budget = await getBudgetSummary(
        month,
        year
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
  }, [isAuthenticated, filterMonth, filterYear]);

  const handleDashboardFilterChange = (month, year) => {
    setFilterMonth(month);
    setFilterYear(year);
  };

  if (!isAuthenticated) {
    if (showLanding) {
      return <Landing />;
    }
    return <Login onLoginSuccess={() => { setIsAuthenticated(true); setShowLanding(false); }} />;
  }

  return (
    <div className={`app-shell ${isDark ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">💰</div>
          <div className="sidebar-logo-text">BudgetTracker</div>
        </div>

        {currentUser && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-email">{currentUser.email}</div>
          </div>
        )}

        <div className="sidebar-section-label">Overview</div>
        <nav className="sidebar-nav">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
            title="Dashboard"
          >
            <span className="icon">📊</span>
            <span className="label">Dashboard</span>
          </button>
          <button
            className={currentPage === "budget" ? "active" : ""}
            onClick={() => setCurrentPage("budget")}
            title="Budget"
          >
            <span className="icon">💰</span>
            <span className="label">Budget</span>
          </button>
          <button
            className={currentPage === "transactions" ? "active" : ""}
            onClick={() => setCurrentPage("transactions")}
            title="Transactions"
          >
            <span className="icon">📝</span>
            <span className="label">Transactions</span>
          </button>
          <button
            className={currentPage === "savings-goals" ? "active" : ""}
            onClick={() => setCurrentPage("savings-goals")}
            title="Savings Goals"
          >
            <span className="icon">🎯</span>
            <span className="label">Savings Goals</span>
          </button>
          <button
            className={currentPage === "bill-reminders" ? "active" : ""}
            onClick={() => setCurrentPage("bill-reminders")}
            title="Bill Reminders"
          >
            <span className="icon">🔔</span>
            <span className="label">Bill Reminders</span>
          </button>
        </nav>

        <div className="sidebar-section-label">Account</div>
        <nav className="sidebar-nav">
          <button
            className={currentPage === "profile" ? "active" : ""}
            onClick={() => setCurrentPage("profile")}
            title="Profile"
          >
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <small>© {new Date().getFullYear()} BudgetTracker</small>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="title">Financial Dashboard</h1>
            <p className="subtitle">
              Monitor your budget, expenses, and income in one place.
            </p>
          </div>

          <div className="header-right">
            <button
              onClick={toggleTheme}
              style={{
                padding: "8px 12px",
                background: isDark ? "#fbbf24" : "#1e293b",
                color: isDark ? "#1e293b" : "#fbbf24",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                marginRight: "12px",
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </header>

        <ConfirmationDialog
          isOpen={showLogoutConfirmation}
          title="Logout?"
          message="Are you sure you want to logout? You'll need to sign in again to access your account."
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
          type="warning"
        />

        <div className="main-surface">
          <div className="main-content">
            {currentPage === "dashboard" && (
              <Dashboard
                summary={summary}
                categoryData={categoryData}
                monthlyData={monthlyData}
                budgetData={budgetData}
                filterMonth={filterMonth}
                filterYear={filterYear}
                onFilterChange={handleDashboardFilterChange}
              />
            )}

            {currentPage === "budget" && (
              <Budget onBudgetUpdated={fetchDashboardData} />
            )}

            {currentPage === "transactions" && (
              <Transactions onTransactionAdded={fetchDashboardData} />
            )}

            {currentPage === "profile" && <Profile />}
            {currentPage === "savings-goals" && <SavingsGoals />}
            {currentPage === "bill-reminders" && <BillReminders />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
