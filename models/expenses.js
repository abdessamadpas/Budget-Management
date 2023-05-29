const mongoose = require('./connection/index');

//expenses schema:
const ExpenseSchema = new mongoose.Schema({
   description : {
      type: String,
   },
   amount: {
      type: Number,
      required: true,
   },
   paiby:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   beneficiaries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
}, {timestamps: true});

module.exports=mongoose.model('Expense', ExpenseSchema);