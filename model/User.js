import mongoose from "mongoose";

const signupUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true
  },
  
  role:{
    type: String,
    enum:["USER", "ADMIN"],
    default: "USER"
  }

}, { timestamps: true });

const User = mongoose.model("User", signupUserSchema);
export default User;
