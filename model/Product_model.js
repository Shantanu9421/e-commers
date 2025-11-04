import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_description: { type: String },
  product_stock: { type: Number, required: true },
  availableStock: { type: Number, default: 0 },
  reservedStock: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);
export default Product;


