import {Router} from "express";
import { createUser, login, sendEmail, forgotPassword, verifyToken, changePassword } from "./user.controller.js";
import { AdminUserGuard, verifyTokenGuard } from "../middleware/guard.middleware.js";

const userRouter = Router();


// @POST /api/user/signup
userRouter.post("/signup",createUser);

// @POST /api/user/login
userRouter.post("/login",login);

// @POST /api/user/login
userRouter.post("/send-mail",sendEmail);

// @POST /api/user/forgot-password
userRouter.post("/forgot-password",forgotPassword);

// @GET /api/user/session
userRouter.get("/session",AdminUserGuard,(req,res)=>{
    return res.json({message:"success"});
});

// @POST /api/user/verify-token
userRouter.post("/verify-token",verifyTokenGuard, verifyToken);

// @POST /api/user/verify-token
userRouter.put("/change-password",verifyTokenGuard, changePassword);

export default userRouter;