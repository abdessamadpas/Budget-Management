const mongoose =  require ('mongoose');

//expensestype schema:

const ExpenseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}); 

//model :
module.exports=mongoose.model('ExpenseType', ExpenseTypeSchema);