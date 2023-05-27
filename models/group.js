const mongoose =  require ('./connection/index');

//group schemas:
const GroupeSchemas = new mongoose.Schema({
    members:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
    ,
    expenses: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Expense'
    },
    reimbursement: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Reimbursement'
    }
}, {timestamps: true});

//create group model:

module.exports=mongoose.model('Group',GroupeSchemas);