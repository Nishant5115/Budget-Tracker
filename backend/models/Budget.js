const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
