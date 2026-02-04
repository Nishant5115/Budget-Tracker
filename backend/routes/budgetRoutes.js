const express=require("express");
const router= express.Router();

const{setBudget}= require("../controllers/budgetController");

router.post("/", setBudget);

module.exports= router;