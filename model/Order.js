import mongoose from "mongoose";

const ordeerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    totalAmount: {
        type: Number,
        // required: true,
    },

    status: {
        type: String,
        enum: ["PENDING_PAYMENT", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PENDING_PAYMENT",
    },
    payment_Status:{
        type: String,
    },
    
     
},{ timestamps: true})

const Order = mongoose.model("Order", ordeerSchema);
export default Order;