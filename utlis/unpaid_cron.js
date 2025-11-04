import cron from "node-cron";
import Order from "../model/Order.js";
import Product from "../model/Product_model.js";


cron.schedule("*/5 * * * *", async () => { 
  const cutoff = new Date(Date.now() - 15 * 60 * 1000);
  const unpaidOrders = await Order.find({
    status: "PENDING_PAYMENT",
    createdAt: { $lt: cutoff },
  });

  for (const order of unpaidOrders) {
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      product.availableStock += item.quantity;
      product.reservedStock -= item.quantity;
      await product.save();
    }
    order.status = "CANCELLED";
    await order.save();
    console.log(`Order ${order._id} auto-cancelled.`);
  }
});
