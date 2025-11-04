import Order from "../model/Order.js";
import Payment from "../model/payment_model.js";
import Product from "../model/Product_model.js";

export const completePayment = async (req, res) => {
  try {
    const { id } = req.params
    const {  transactionId, success } = req.body; // success = true/false

    const order = await Order.findById(id).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    // console.log(order)

    if (order.status !== "PENDING_PAYMENT") {
      return res.status(400).json({ message: "Order already processed" });
    }
    const amount = order.totalAmount

    const payment = new Payment({
      id,
      transactionId,
      amount,
      status: success ? "SUCCESS" : "FAILED",
    });
    await payment.save();

    if (success) {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
        product.availableStock = Math.max(0, product.availableStock - item.quantity);
        await product.save();
      }

      order.status = "PAID";
      order.payment_Status = "PAID";
      order.transactionId = transactionId;
      order.totalAmount = amount;
      await order.save();

      setTimeout(() => {
        console.log(`Confirmation email sent for order`);
      }, 1000);

      return res.json({
        success: true,
        message: "Payment successful, order confirmed",
        order,
        payment,
      });

    } else {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.availableStock += item.quantity;
        product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
        await product.save();
      }

      order.status = "CANCELLED";
      order.payment_Status = "FAILED";
      order.transactionId = transactionId;
      order.totalAmount = amount;
      await order.save();

      return res.json({
        success: false,
        message: "Payment failed, order cancelled and stock released",
        order,
        payment,
      });
    }
  } catch (err) {
    console.error("Error completing payment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
