import express from 'express';
import connectDB from './config/db.js';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import auth_routes from './routes/Auth_routes.js';
import product_routes from './routes/Product_routes.js';
import cart_route from './routes/cart.js';
import "./utlis/unpaid_cron.js"
import payment_route from './routes/Payment_route.js';
import admin_routes from './routes/admin_routes.js';
import order_routes from './routes/order_user.js';


// import { createStaticReceptionist } from './controlller/Admin_controller.js';

config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

connectDB();


app.use('/api', cart_route)
app.use('/api/product', product_routes)
app.use('/api', auth_routes)
app.use('/api', admin_routes)
app.use('/api/payment', payment_route)
app.use('/api/user', order_routes)


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
