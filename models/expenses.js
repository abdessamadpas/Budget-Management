const mongoose = require('./connection/index');

//expenses schema:
const ExpenseSchema = new mongoose.Schema({
   id: Number,
   description : String,
   amount: Number,
   paiby:String,
   beneficiaires:String,
   type: String 
});

//expenses model:
const Expenses = mongoose.model('Expenses', ExpenseSchema);

module.exports=Expenses;