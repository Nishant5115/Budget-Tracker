const express= require("express");
const router= express.Router();

const{ addTransaction, getTransactions, deleteTransaction, updateTransaction,getSummary,getCategorySummary,monthlySummary}= require("../controllers/transactionController");

router.post("/", addTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);
router.get("/summary", getSummary);
router.get("/category-summary", getCategorySummary);
router.get("/monthly-summary", monthlySummary);
module.exports= router;