const BillReminder = require("../models/BillReminder");
const User = require("../models/User");
const { sendBillReminderEmail } = require("../utils/emailService");

const createBillReminder = async (req, res) => {
  try {
    const {
      title,
      amount,
      dueDate,
      category,
      description,
      isRecurring,
      recurringFrequency,
      reminderDaysBefore,
    } = req.body;

    if (!title || !amount || !dueDate) {
      return res.status(400).json({
        message: "Title, amount, and due date are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }

    const reminder = await BillReminder.create({
      title,
      amount,
      dueDate: new Date(dueDate),
      category: category || "Bills",
      description: description || "",
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || "monthly",
      reminderDaysBefore: reminderDaysBefore || 3,
      user: req.user._id,
    });

    // Send email notification
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      sendBillReminderEmail(user.email, user.name, {
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        category: reminder.category,
        description: reminder.description,
      });
    }

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBillReminders = async (req, res) => {
  try {
    const reminders = await BillReminder.find({ user: req.user._id })
      .sort({ dueDate: 1 })
      .lean();

    const remindersWithStatus = reminders.map((reminder) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(reminder.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...reminder,
        daysUntilDue: diffDays,
        isOverdue: !reminder.isPaid && diffDays < 0,
      };
    });

    res.status(200).json(remindersWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBillReminder = async (req, res) => {
  try {
    const { dueDate } = req.body;

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ message: "Due date cannot be in the past" });
      }
    }

    const reminder = await BillReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Bill reminder not found" });
    }

    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBillReminder = async (req, res) => {
  try {
    const reminder = await BillReminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Bill reminder not found" });
    }

    res.status(200).json({ message: "Bill reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markBillAsPaid = async (req, res) => {
  try {
    const reminder = await BillReminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Bill reminder not found" });
    }

    reminder.isPaid = true;
    await reminder.save();

    // Send email confirmation
    const { sendBillPaymentConfirmationEmail } = require("../utils/emailService");
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      sendBillPaymentConfirmationEmail(user.email, user.name, {
        title: reminder.title,
        amount: reminder.amount,
        category: reminder.category,
      });
    }

    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBillReminder,
  getBillReminders,
  updateBillReminder,
  deleteBillReminder,
  markBillAsPaid,
};

