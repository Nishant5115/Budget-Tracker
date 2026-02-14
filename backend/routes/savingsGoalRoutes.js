const express = require("express");
const router = express.Router();
const {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal,
} = require("../controllers/savingsGoalController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSavingsGoal);
router.get("/", protect, getSavingsGoals);
router.put("/:id", protect, updateSavingsGoal);
router.delete("/:id", protect, deleteSavingsGoal);
router.post("/:id/add", protect, addToSavingsGoal);

module.exports = router;

