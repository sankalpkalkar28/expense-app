import express from "express";
import adminController from "./admin.controller.js";
import { AdminGuard } from "../middleware/guard.middleware.js"; // Use your existing AdminGuard

const router = express.Router();

// Apply AdminGuard to all admin routes
router.use(AdminGuard); // This applies to all routes below

// Admin routes
router.get("/users", adminController.getAllUsers);
router.get("/team-summary", adminController.getTeamSummary);
router.get("/reports/user/:userId", adminController.getUserTransactions);

export default router;