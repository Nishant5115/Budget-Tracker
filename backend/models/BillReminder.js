const mongoose = require("mongoose");

const billReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      default: "Bills",
    },
    description: {
      type: String,
      default: "",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    reminderDaysBefore: {
      type: Number,
      default: 3,
      min: 0,
      max: 30,
    },
  },
  { timestamps: true }
);

billReminderSchema.virtual("daysUntilDue").get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

billReminderSchema.virtual("isOverdue").get(function () {
  if (this.isPaid) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
});

module.exports =
  mongoose.models.BillReminder ||
  mongoose.model("BillReminder", billReminderSchema);

