import express from "express"
import { AdminMiddle } from "../middleware/AdminMiddle.js"
import { Addproduct, getProduct } from "../controlller/Product.js"
import { placeOrder } from "../controlller/User_auth.js"
import { userAuth } from "../middleware/Auth.js"
import { updateOrderStatus } from "../controlller/admin_order.js"

const product_routes = express.Router()

product_routes.post("/add", AdminMiddle, Addproduct)
product_routes.get("/get",  getProduct)
product_routes.post("/orders/checkout",userAuth, placeOrder)


export default product_routes