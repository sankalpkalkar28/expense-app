import { Router } from "express";
import { AdminUserGuard } from "../middleware/guard.middleware.js";
const TransactionRouter = Router();
import { 
    createTransaction,
    deleteTransaction,
    getTransaction,
    updateTransaction,
    
} from "./transaction.controller.js";

TransactionRouter.post("/create",AdminUserGuard,createTransaction);
TransactionRouter.put("/update/:id",AdminUserGuard,updateTransaction);
TransactionRouter.delete("/delete/:id",AdminUserGuard,deleteTransaction);
TransactionRouter.get("/get",AdminUserGuard,getTransaction);

export default TransactionRouter;