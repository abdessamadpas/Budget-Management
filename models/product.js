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

const Product = mongoose.model('Product',ProductSchema);