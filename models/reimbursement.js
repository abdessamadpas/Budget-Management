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

module.export=mongoose.model('Reimbursement',ReimbursementSchema);;

