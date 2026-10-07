import TransactionModel from "../transaction/transaction.model.js";
import UserModel from "../user/user.model.js";

console.log("🚀 FRESH FILE - DEC 2024");

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email _id');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getTeamSummary = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const allTransactions = await TransactionModel.find();
        
        let total = 0;
        for (let t of allTransactions) {
            total = total + (t.amount || 0);
        }
        
        const allUsers = await UserModel.find();
        
        const userSpendingMap = {};
        for (let user of allUsers) {
            const userId = user._id.toString();
            const userName = user.fullname || user.name || user.username || "Unknown";
            userSpendingMap[userId] = {
                name: userName,
                total: 0
            };
        }
        
        for (let t of allTransactions) {
            const userId = t.userId.toString();
            if (userSpendingMap[userId]) {
                userSpendingMap[userId].total += (t.amount || 0);
            }
        }
        
        let topSpenderName = "No transactions";
        let maxAmount = 0;
        
        for (let userId in userSpendingMap) {
            if (userSpendingMap[userId].total > maxAmount) {
                maxAmount = userSpendingMap[userId].total;
                topSpenderName = userSpendingMap[userId].name;
            }
        }
        
        res.json({
            total: total,
            topSpender: topSpenderName,
            totalUsers: totalUsers
        });
        
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: err.message });
    }
};

export const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await TransactionModel
            .find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.json({ transactions: transactions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default {
    getAllUsers,
    getTeamSummary,
    getUserTransactions
};