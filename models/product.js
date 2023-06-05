const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    expense: {
        type: Schema.Types.ObjectId,
        ref: 'Expense'
    },
    image: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ExpenseType'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

}, {timestamps: true});

module.exports = mongoose.model('Product',ProductSchema);