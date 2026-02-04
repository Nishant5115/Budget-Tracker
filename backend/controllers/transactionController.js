const Transaction = require("../models/Transaction");


// Jab route call kare, tab ye function chalega
const addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async(req,res)=>{
    try{
        const transaction= await Transaction.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!transaction){
            return res.status(404).json({message: "Transaction not found"});
        }  
        res.status(200).json(transaction);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else if (t.type === "expense") {
        totalExpense += t.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: "expense" });

    const categorySummary = {};

    transactions.forEach((t) => {
      if (categorySummary[t.category]) {
        categorySummary[t.category] += t.amount;
      } else {
        categorySummary[t.category] = t.amount;
      }
    });

    res.status(200).json(categorySummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const monthlySummary = async(req,res)=>{
  try{
    const transaction= await Transaction.find({type:"expense"});
    const monthlySummary={};

    transaction.forEach((t)=>{
      const date= new Date(t.date);
      const month= date.toLocaleString("default", {month:"short"});
      const year=date.getFullYear();
      const key=`${month}-${year}`;
      if(monthlySummary[key]){
        monthlySummary[key]+=t.amount;
      }else{
        monthlySummary[key]=t.amount;
      } 
    });
    res.status(200).json(monthlySummary);
  }catch(error){
    res.status(500).json({message: error.message});
  }
};



module.exports = { addTransaction, getTransactions, deleteTransaction, updateTransaction, getSummary,getCategorySummary ,monthlySummary};