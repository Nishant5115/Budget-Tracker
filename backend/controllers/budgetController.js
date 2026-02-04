const Budget = require("../models/Budget");

const setBudget=async(req,res)=>{
    try{
        const budget= await Budget.create(req.body);
        res.status(201).json(budget);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};
module.exports={setBudget};