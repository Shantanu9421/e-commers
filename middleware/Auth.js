import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.js";
dotenv.config(); 


export const userAuth = async (req, res, next) => {
  try {
   
    const { user_auth } = req.cookies;
    // console.log(user_auth)  

    if (!user_auth) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const decoded = jwt.verify(user_auth, process.env.JWT_SECRET);
    const { id } = decoded;
    // console.log(id)
   

    const user = await User.findById(id)
    // console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; 
    next(); 
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
