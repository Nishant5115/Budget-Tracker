
const Transaction = require("../models/Transaction");


const addTransaction = async (req, res) => {


  try {
    const { amount, type, category, date } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      user: req.user._id, 
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    });

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
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // 🔑
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id, // 🔑
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      if (t.type === "expense") totalExpense += t.amount;
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCategorySummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
    });

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
