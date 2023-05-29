const mongoose = require ('./conncetion/index');

//expensestype schema:

const ExpenseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}); 

//model :
module.exports=mongoose.model('ExpenseType', ExpenseTypeSchema);