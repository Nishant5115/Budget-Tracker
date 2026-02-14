const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
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
    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

savingsGoalSchema.virtual("progress").get(function () {
  return this.targetAmount > 0
    ? Math.min((this.currentAmount / this.targetAmount) * 100, 100)
    : 0;
});

savingsGoalSchema.virtual("remainingAmount").get(function () {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

module.exports =
  mongoose.models.SavingsGoal ||
  mongoose.model("SavingsGoal", savingsGoalSchema);

