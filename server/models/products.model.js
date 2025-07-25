const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProductEntity', ProductSchema, 'products');