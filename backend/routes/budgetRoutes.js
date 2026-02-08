const express = require("express");
const router = express.Router();

const {
  setBudget,
  getBudgetSummary,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, setBudget);
router.get("/summary", protect, getBudgetSummary);

module.exports = router;
