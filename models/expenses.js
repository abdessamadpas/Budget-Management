const mongoose =  require ('mongoose');
// Path: models\expenses.js

const ExpenseSchema = new mongoose.Schema({
   description : {
      type: String,
      required: true,
   },
   amount: {
      type: Number,
      required: true,
   },
   paiby:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   Group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
   },
   products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
   }],
}, {timestamps: true}

);

module.exports=mongoose.model('Expense', ExpenseSchema);
