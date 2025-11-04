import express from "express"
import { completePayment } from "../controlller/payment_controller.js"

const payment_route = express.Router()

payment_route.post("/orders/:id/pay", completePayment)

export default payment_route