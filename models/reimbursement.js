const mongoose = require('mongoose');


const ReimbursementSchema = new mongoose.Schema({
    expenses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Expense'
    }], 
    receipt: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    amount: {
        type: Number,
        required: true,
    },
}, {timestamps: true}); 

module.exports=mongoose.model('Reimbursement',ReimbursementSchema);;
// const Reimbursement = mongoose.model('Reimbursement', ReimbursementSchema);

// module.exports = Reimbursement;
