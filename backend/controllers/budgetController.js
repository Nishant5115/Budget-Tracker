const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// ================= SET / UPDATE BUDGET =================
const setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    if (!category || !limit || !month || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    let budget = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year,
    });

    if (budget) {
      
      budget.limit = limit;
      await budget.save();
    } else {
      
      budget = await Budget.create({
        user: req.user._id,
        category,
        limit,
        month,
        year,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    
    const budget = await Budget.findOne({
      user: req.user._id,
      month,
      year,
    });

    if (!budget) {
      return res
        .status(404)
        .json({ message: "No budget set for this month" });
    }

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      category: budget.category,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const totalExpense = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const remaining = budget.limit - totalExpense;

    res.status(200).json({
      category: budget.category,
      limit: budget.limit,
      spent: totalExpense,
      remaining,
      status: remaining >= 0 ? "within budget" : "overspent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, getBudgetSummary };
