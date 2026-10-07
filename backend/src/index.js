import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

dotenv.config();

const app = express();

// database connection
// mongoose.connect(process.env.DB_URL)
// .then(()=>{
//     console.log("Database connected !");
//     app.listen(3030,()=>console.log("Server is running on port 3030"));
// })
// .catch(()=>console.log("Database not connected"));

const PORT = process.env.PORT || 3030;

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => console.log("Database not connected", error));

app.use(cookieParser());
// app.use(cors({
//     origin : process.env.DOMAIN,
//     credentials : true,
// }));

const allowedOrigins = [
    "http://localhost:5173",
    "https://expense-app-bay-eight.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// app level middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// route level middleware
import userRouter from "./user/user.routes.js";
import TransactionRouter from "./transaction/transaction.route.js";
import DashboardRouter from "./dashboard/dashboard.route.js";
import adminRouter from "./admin/admin.routes.js";

app.use("/api/user",userRouter);
app.use("/api/transaction",TransactionRouter);
app.use("/api/dashboard",DashboardRouter);
app.use("/api/admin", adminRouter);