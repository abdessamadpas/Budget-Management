const mongoose = require('./connection/index');

//reimbursement schema:
const ReimbursementSchema = new mongoose.Schema({
    id: Number,
    expenses:Float, //foreignkey expense table
    receipent: Float,
    amount:Number
}); 

const Reimbursement = mongoose.model('Reimbursement',ReimbursementSchema);

module.export=Reimbursement;

