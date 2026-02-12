const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");


const setBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;

    if (!amount || !month || !year) {
      return res.status(400).json({ message: "Amount, month, and year are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Budget amount must be greater than 0" });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ message: "Month must be between 1 and 12" });
    }

    // Validate that budget month/year is not in the past
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const selectedYear = Number(year);
    const selectedMonth = Number(month);

    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
      return res.status(400).json({ message: "Cannot set budget for past dates. Please select valid month and year." });
    }

    let budget = await Budget.findOne({
      user: req.user._id,
      month: Number(month),
      year: Number(year),
    });

    if (budget) {
      
      budget.amount = Number(amount);
      await budget.save();
    } else {
      
      budget = await Budget.create({
        user: req.user._id,
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Budget already exists for this month" });
    }
    res.status(500).json({ message: error.message });
  }
};


const checkBudgetExists = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const budget = await Budget.findOne({
      user: req.user._id,
      month: Number(month),
      year: Number(year),
    });

    res.status(200).json({
      exists: !!budget,
      budget: budget ? { id: budget._id, amount: budget.amount } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const budget = await Budget.findOne({
      user: req.user._id,
      month: Number(month),
      year: Number(year),
    });

    if (!budget) {
      return res
        .status(404)
        .json({ message: "No budget set for this month" });
    }

 
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 1);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalExpense = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const remaining = budget.amount - totalExpense;

    res.status(200).json({
      budget: budget.amount,
      spent: totalExpense,
      remaining,
      status: remaining >= 0 ? "within budget" : "overspent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, checkBudgetExists, getBudgetSummary };
