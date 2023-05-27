const mongoose = require ('./conncetion/index');

//expensestype schema:

const ExpenseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}); 

//model :
const ExpenseType = mongoose.model('ExpenseType', ExpenseTypeSchema);

module.exports=ExpenseType;