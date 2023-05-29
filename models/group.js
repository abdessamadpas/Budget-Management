const mongoose =  require ('mongoose');


const GroupeSchemas = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    balance : {
        type : Number,
        default : 0
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    expenses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Expense'
    }],
    reimbursement : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Reimbursement'
    }],
}, {timestamps: true});


module.exports=mongoose.model('Group',GroupeSchemas);
