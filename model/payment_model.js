import mongoose from "mongoose";

const paymentschema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    transactionId: String,
    amount: Number,
    status: { type: String, enum: ['SUCCESS', 'FAILED'] },
})

const payment = mongoose.model("Payment", paymentschema);
export default payment;
