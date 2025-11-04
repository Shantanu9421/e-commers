import express from "express"
import { userAuth } from "../middleware/Auth.js"
import { getallorders, singleorder } from "../controlller/User_auth.js"

const order_routes = express.Router()

order_routes.get("/orders", userAuth, getallorders)
order_routes.get("/orders/:id", userAuth, singleorder)

export default order_routes