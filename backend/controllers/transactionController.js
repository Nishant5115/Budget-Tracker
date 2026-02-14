const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Budget = require("../models/Budget");
const { sendTransactionNotificationEmail, sendBudgetAlertEmail } = require("../utils/emailService");

const addTransaction = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { amount, category, date, type, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const transaction = await Transaction.create({
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      type: type || "expense",
      description: description || "",
      user: req.user._id,
    });

    // Send email notification
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      await sendTransactionNotificationEmail(user.email, user.name, {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description,
      });

      // Check budget alerts if this is an expense transaction
      if (transaction.type === "expense") {
        const now = new Date(transaction.date);
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const budget = await Budget.findOne({
          user: req.user._id,
          month: currentMonth,
          year: currentYear,
        });

        if (budget) {
          // Get all expenses for this month up to today
          const startDate = new Date(currentYear, currentMonth - 1, 1);
          const endDate = new Date(currentYear, currentMonth, 1);

          const expenses = await Transaction.find({
            user: req.user._id,
            type: "expense",
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          });

          const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
          const percentageUsed = (totalExpense / budget.amount) * 100;

          // Send alert if budget is 80% or more utilized
          if (percentageUsed >= 80) {
            await sendBudgetAlertEmail(user.email, user.name, {
              category: "Overall Budget",
              limit: budget.amount,
              spent: totalExpense,
            }, Math.round(percentageUsed));
          }
        }
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTransactions = async (req, res) => {
  try {
    const { type, from, to, category } = req.query;

    const query = { user: req.user._id };

    if (type && (type === "income" || type === "expense")) {
      query.type = type;
    }

    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from);
      }
      if (to) {
        query.date.$lte = new Date(to);
      }
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const match = { user: req.user._id };

    if (month && year) {
      const m = Number(month);
      const y = Number(year);
      match.date = {
        $gte: new Date(y, m - 1, 1),
        $lt: new Date(y, m, 1),
      };
    }

    const transactions = await Transaction.find(match);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const match = {
      user: req.user._id,
      type: "expense",
    };

    if (month && year) {
      const m = Number(month);
      const y = Number(year);
      match.date = {
        $gte: new Date(y, m - 1, 1),
        $lt: new Date(y, m, 1),
      };
    }

    const transactions = await Transaction.find(match);

    const categorySummary = {};

    transactions.forEach((t) => {
      categorySummary[t.category] =
        (categorySummary[t.category] || 0) + t.amount;
    });

    res.status(200).json(categorySummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const monthlySummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
    });

    const monthlySummary = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.toLocaleString("default", {
        month: "short",
      })}-${date.getFullYear()}`;

      monthlySummary[key] = (monthlySummary[key] || 0) + t.amount;
    });

    res.status(200).json(monthlySummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getSummary,
  getCategorySummary,
  monthlySummary,
};
