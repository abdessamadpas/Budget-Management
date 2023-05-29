const { Schema } = require('mongoose');


const ReimbursementSchema = new mongoose.Schema({
    expenses:[{
        type : Schema.Types.ObjectId,
        ref : 'Expense'
    }], 
    receipt: [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    amount: {
        type: Number,
        required: true,
    },
}, {timestamps: true}); 

module.export=mongoose.model('Reimbursement',ReimbursementSchema);;

