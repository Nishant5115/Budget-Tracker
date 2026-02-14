const SavingsGoal = require("../models/SavingsGoal");
const User = require("../models/User");
const {
  sendSavingsGoalCreatedEmail,
  sendSavingsGoalCompletedEmail,
} = require("../utils/emailService");

const createSavingsGoal = async (req, res) => {
  try {
    const { title, targetAmount, targetDate, description, category } = req.body;

    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({
        message: "Title, target amount, and target date are required",
      });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ message: "Target amount must be greater than 0" });
    }

    const selectedDate = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ message: "Target date cannot be in the past" });
    }

    const goal = await SavingsGoal.create({
      title,
      targetAmount,
      targetDate: new Date(targetDate),
      description: description || "",
      category: category || "General",
      user: req.user._id,
    });

    // Send email notification
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      sendSavingsGoalCreatedEmail(user.email, user.name, {
        title: goal.title,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        category: goal.category,
        description: goal.description,
      });
    }

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const goalsWithProgress = goals.map((goal) => ({
      ...goal,
      progress: goal.targetAmount > 0
        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
        : 0,
      remainingAmount: Math.max(goal.targetAmount - goal.currentAmount, 0),
    }));

    res.status(200).json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSavingsGoal = async (req, res) => {
  try {
    const { targetDate } = req.body;

    if (targetDate) {
      const selectedDate = new Date(targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ message: "Target date cannot be in the past" });
      }
    }

    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    res.status(200).json({ message: "Savings goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToSavingsGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    if (goal.isCompleted) {
      return res.status(400).json({ message: "This savings goal has already been completed. No more funds can be added." });
    }

    goal.currentAmount = Math.min(
      goal.currentAmount + amount,
      goal.targetAmount
    );

    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    // Send completion email if goal just reached target
    if (goal.isCompleted && goal.currentAmount - amount < goal.targetAmount) {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        sendSavingsGoalCompletedEmail(user.email, user.name, {
          title: goal.title,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
        });
      }
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal,
};

