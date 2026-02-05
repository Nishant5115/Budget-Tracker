const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const setBudget=async(req,res)=>{
  try {
    const { month, year, amount } = req.body;

    const existingBudget = await Budget.findOne({ month, year });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists for this month",
      });
    }

    const budget = await Budget.create(req.body);
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    // 1️⃣ Find budget for given month & year
    const budget = await Budget.findOne({ month, year });

    if (!budget) {
      return res.status(404).json({ message: "No budget set for this month" });
    }

    // 2️⃣ Find all expense transactions for same month & year
    const transactions = await Transaction.find({ type: "expense" });

    let totalExpense = 0;

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (
        date.getMonth() + 1 == month &&
        date.getFullYear() == year
      ) {
        totalExpense += t.amount;
      }
    });

    // 3️⃣ Compare
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



module.exports={setBudget,getBudgetSummary};