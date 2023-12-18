const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        dob: String,
        gender: String,
        email: {
            type: String,
            index: true,
            required: true
        },
        contact: String,
        address: String,
        state: String,
        city: String,
        pinCode: String,
        role: {
            type: String,
            default: 'user',
            required: true
        },
        categories: [
            {
                name: {
                    type: String,
                    trim: true,
                    required: 'Name is required',
                    minlength: [2, 'Too short'],
                    maxlength: [32, 'Too long'],
                },
                description: {
                    type: String,
                    trim: true,
                    required: 'Description is required',
                    minlength: [2, 'Too short'],
                    maxlength: [250, 'Too long'],
                },
                slug: {
                    type: String,
                    lowercase: true,
                    index: true,
                },
            }
        ],
        products: [
            {
                title: {
                    type: String,
                    trim: true,
                    required: true,
                    maxlength: 32,
                    text: true,
                },
                slug: {
                    type: String,
                    unique: true,
                    lowercase: true,
                    index: true,
                },
                description: {
                    type: String,
                    required: true,
                    maxlength: 2000,
                    text: true,
                },
                price: {
                    type: Number,
                    required: true,
                    trim: true,
                    maxlength: 32,
                },
                category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category',
                },
                quantity: Number,
                sold: {
                    type: Number,
                    default: 0,
                },
                images: {
                    type: Array,
                },
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
