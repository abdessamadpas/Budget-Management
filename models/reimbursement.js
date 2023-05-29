const { Schema } = require('mongoose');


//reimbursement schema:
const ReimbursementSchema = new mongoose.Schema({
    expenses:{
        type : Schema.Types.ObjectId,
        ref : 'Expense'
    }, 
    receipt: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    amount: {
        type: Number,
        required: true,
    },
}, {timestamps: true}); 

const Reimbursement = mongoose.model('Reimbursement',ReimbursementSchema);

module.export=Reimbursement;

