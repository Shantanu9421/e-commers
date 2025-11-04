import User from "../model/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cart from "../model/cart.js";
import Order from "../model/Order.js";
import mongoose from "mongoose";


export const userRegister = async (req, res) => {
    try {
        const { name, contact, email, password, role } = req.body
        if (!name || !contact || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            contact,
            email,
            password: hashedPassword,
            role: role || "USER"
        });

        await newUser.save();
        res.status(200).json({ message: "Create account successfull" })

    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.role === "ADMIN") {

            const token = jwt.sign({ id: user._id }, process.env.JWT_ADMIN, { expiresIn: '1d' });

            res.cookie("admin_auth", token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'none',
            })
        }
        else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie("user_auth", token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'none',
            })

        }

        res.status(200).json({
            message: "Login successful",
            user: {
                name: user.name,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("user_auth", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        res.clearCookie("admin_auth", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        res.status(200).json({ message: "Logout successfull" })
    } catch (error) {
        console.log("Internal server error")
        return res.status(500).json({ message: "Internal server eroor" })
    }
}


export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id).session(session);
      if (!product || product.availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.product_name || "unknown product"}`);
      }

      product.availableStock -= item.quantity;
      product.reservedStock += item.quantity;
      await product.save({ session });

      totalAmount += product.product_price * item.quantity;
    }

    const order = new Order({
      userId,
      products: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "PENDING_PAYMENT",
      payment_Status: "UNPAID",
    });

    await order.save({ session });

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Stock reserved.",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getallorders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const singleorder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId })
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching single order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};