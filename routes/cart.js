import express from "express"
import { userAuth } from "../middleware/Auth.js";
import { addToCart, deleteCartItem, getCart } from "../controlller/cart.js";

const cart_route = express.Router()


cart_route.post("/cart/items", userAuth, addToCart);
cart_route.get("/cart", userAuth, getCart);
cart_route.delete("/cart/items/:productId", userAuth, deleteCartItem);

export default cart_route