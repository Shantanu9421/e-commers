import express from "express"
import { AdminMiddle } from "../middleware/AdminMiddle.js"
import { getallorder, updateOrderStatus } from "../controlller/admin_order.js"

const admin_routes = express.Router()

admin_routes.patch("/orders/:id/status", AdminMiddle,updateOrderStatus)
admin_routes.get("/admin/orders", AdminMiddle, getallorder)

export default admin_routes