const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: ObjectId,
                    ref: "Product",
                },
                title: String,
                description: String,
                price: Number,
                count: Number,
                images: Array
            },
        ],
        shipping: Number,
        cartQuantity: Number,
        cartTotal: Number,
        totalAfterDiscount: Number,
        orderdBy: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
