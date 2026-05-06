import TransactionModel from "../transaction/transaction.model.js";
import UserModel from "../user/user.model.js";

// Get all users (for admin dropdown)
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email _id role');
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Failed to fetch users"
        });
    }
}

// Get team summary
export const getTeamSummary = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        
        // Get all transactions
        const allTransactions = await TransactionModel.find();
        
        // Calculate total spending
        const total = allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        
        // Find top spender
        const userSpending = {};
        for (const transaction of allTransactions) {
            const userId = transaction.userId.toString();
            userSpending[userId] = (userSpending[userId] || 0) + transaction.amount;
        }
        
        let topSpenderName = "No data";
        let maxSpent = 0;
        
        for (const [userId, spent] of Object.entries(userSpending)) {
            if (spent > maxSpent) {
                maxSpent = spent;
                const user = await UserModel.findById(userId);
                topSpenderName = user ? user.name : "Unknown";
            }
        }
        
        res.json({
            total: total,
            topSpender: topSpenderName,
            totalUsers: totalUsers
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Failed to fetch team summary"
        });
    }
}

// Get specific user's transactions
export const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const transactions = await TransactionModel
            .find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.json({
            transactions: transactions
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Failed to fetch user transactions"
        });
    }
}

export default {
    getAllUsers,
    getTeamSummary,
    getUserTransactions
};