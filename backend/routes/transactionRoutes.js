const express= require("express");
const router= express.Router();
const { protect } = require("../middleware/authMiddleware");

const{ addTransaction, getTransactions, deleteTransaction, updateTransaction,getSummary,getCategorySummary,monthlySummary}= require("../controllers/transactionController");

router.post("/",protect, addTransaction);
router.get("/", protect,getTransactions);
router.delete("/:id",protect, deleteTransaction);
router.put("/:id", protect, updateTransaction);
router.get("/summary",protect, getSummary);
router.get("/category-summary",protect, getCategorySummary);
router.get("/monthly-summary", protect,monthlySummary);
module.exports= router;