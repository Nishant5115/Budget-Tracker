const express = require("express");
const router = express.Router();
const {
  createBillReminder,
  getBillReminders,
  updateBillReminder,
  deleteBillReminder,
  markBillAsPaid,
} = require("../controllers/billReminderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBillReminder);
router.get("/", protect, getBillReminders);
router.put("/:id", protect, updateBillReminder);
router.delete("/:id", protect, deleteBillReminder);
router.post("/:id/mark-paid", protect, markBillAsPaid);

module.exports = router;

