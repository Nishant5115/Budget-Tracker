const express = require("express");
const router = express.Router();

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getSummary,
  getCategorySummary,
  monthlySummary,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.get("/summary", protect, getSummary);
router.get("/category-summary", protect, getCategorySummary);
router.get("/monthly-summary", protect, monthlySummary);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
