const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");


const getMe = async (req, res) => {
  try {
    const user = req.user;

    const transactions = await Transaction.find({ user: user._id });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const now = new Date();
    const currentBudget = await Budget.findOne({
      user: user._id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      stats: {
        totalIncome,
        totalExpense,
        balance,
        currentBudget: currentBudget ? currentBudget.amount : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Nothing to update. Provide name or email." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    await user.save();

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    // Handle duplicate email gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateMe,};



