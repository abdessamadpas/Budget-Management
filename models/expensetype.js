const mongoose = require ('./conncetion/index');

//expensestype schema:

const ExpenseTypeSchema = new mongoose.Schema({
    id: Number,
    name: String
}); 

//model :
const ExpenseType = mongoose.model('ExpenseType', ExpenseTypeSchema);

module.exports=ExpenseType;