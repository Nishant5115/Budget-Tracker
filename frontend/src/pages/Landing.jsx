import { useState } from "react";
import Login from "./Login";
import "./Landing.css";

function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login onLoginSuccess={() => window.location.reload()} />;
  }

  const navigate = () => {
    setShowLogin(true);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Hero Section */}
        <header className="landing-header">
          <div className="landing-logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">BudgetTracker</span>
          </div>
          <button className="landing-cta-button" onClick={navigate}>
            Get Started
          </button>
        </header>

        {/* Main Hero */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Take Control of Your
              <span className="gradient-text"> Finances</span>
            </h1>
            <p className="hero-subtitle">
              Track expenses, set budgets, and achieve your financial goals with our
              intuitive budget management platform.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={navigate}>
                Start Tracking
              </button>
              <button className="btn-secondary" onClick={navigate}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">📊</div>
              <div className="card-title">Dashboard</div>
              <div className="card-amount">₹45,000</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💰</div>
              <div className="card-title">Budget</div>
              <div className="card-amount">₹50,000</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📈</div>
              <div className="card-title">Savings</div>
              <div className="card-amount">₹5,000</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          <h2 className="section-title">Why Choose BudgetTracker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                Visualize your spending patterns with interactive charts and insights.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Goal Tracking</h3>
              <p className="feature-description">
                Set and track savings goals to achieve your financial dreams.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Bill Reminders</h3>
              <p className="feature-description">
                Never miss a payment with smart bill reminders and notifications.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-description">
                Access your budget anywhere, anytime with our responsive design.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your financial data is encrypted and protected with industry standards.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast & Easy</h3>
              <p className="feature-description">
                Quick transaction entry and intuitive interface for seamless experience.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="landing-cta">
          <h2 className="cta-title">Ready to Transform Your Finances?</h2>
          <p className="cta-subtitle">Join thousands of users managing their budgets effectively.</p>
          <button className="btn-primary btn-large" onClick={navigate}>
            Get Started Free
          </button>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} BudgetTracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Landing;

