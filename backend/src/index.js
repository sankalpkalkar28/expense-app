import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

dotenv.config();

const app = express();

// database connection
mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database connected !");
    app.listen(3030,()=>console.log("Server is running on port 3030"));
})
.catch(()=>console.log("Database not connected"));

app.use(cookieParser());
app.use(cors({
    origin : process.env.DOMAIN,
    credentials : true,
}));

// app level middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// route level middleware
import userRouter from "./user/user.routes.js";
app.use("/api/user",userRouter);