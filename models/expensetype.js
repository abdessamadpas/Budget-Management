const mongoose =  require ('mongoose');

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