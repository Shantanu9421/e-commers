import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from '../model/User.js';
dotenv.config(); 

export const AdminMiddle = async (req, res, next) => {
  try {
    const { admin_auth } = req.cookies;

    if (!admin_auth) {
      return res.status(401).json({ message: 'Authentication required ' });
    }

    const decoded = jwt.verify(admin_auth, process.env.JWT_ADMIN);
    
    const { id }  = decoded;
   

    const admin = await User.findById(id) ;
    // console.log("admin", admin);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Please authenticate', err });
  }
};