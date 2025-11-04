import express from "express"
import { Login, logoutUser,  userRegister } from "../controlller/User_auth.js"

const auth_routes = express.Router()

auth_routes.post("/auth/register", userRegister)
auth_routes.post("/auth/login", Login)
auth_routes.post("/logout", logoutUser)

export default auth_routes