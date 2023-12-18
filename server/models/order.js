const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
        },
        images: [],
        description: String,
        count: Number,
        price: Number,
        title: String
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "processing",
        "Dispatched",
        "Cancelled",
        "Completed",
      ],
    },
    orderTotal: Number,
    shipping: Number,
    orderdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
