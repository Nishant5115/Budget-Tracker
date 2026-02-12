const express = require("express");
const router = express.Router();

const {
  setBudget,
  checkBudgetExists,
  getBudgetSummary,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, setBudget);
router.get("/check", protect, checkBudgetExists);
router.get("/summary", protect, getBudgetSummary);

module.exports = router;
