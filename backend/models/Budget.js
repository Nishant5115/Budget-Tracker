const mongoose= require("mongoose");
const BudgetSchema= new mongoose.Schema({
    category:{
        type:String,
         required:true,
    },
    limit:{
        type:Number,
        required:true,
    },
    month:{
        type:String,
        required:true,
    },
},
{timestamps:true}

);

module.exports= mongoose.model("Budget", BudgetSchema);