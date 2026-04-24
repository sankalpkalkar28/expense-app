import TransactionModel from "./transaction.model.js";

export const createTransaction = async (req,res) => {
    try{
        const data = req.body;
        const {id} = req.user;
        data.userId = id;
        const transaction = await new TransactionModel(data).save();
        res.json(transaction);
    }catch(err){
        res.status(500).json({
            message : err.message || "Internal server error.",
        })
    }
}

export const updateTransaction = async (req,res) => {
    try{
        const data = req.body;
        const {id} = req.params;
        const transaction = await TransactionModel.findByIdAndUpdate(id,data,{new:true});
        if(!transaction)
            return res.status(404).json({
                message : "Transaction not found !",
                data : transaction
            });
        res.json(transaction)
    }catch(err){
        res.status(500).json({
            message : err.message || "Internal server error.",
        })
    }
}

export const deleteTransaction = async (req,res) => {
    try{
        const {id} = req.params;
        const transaction = await TransactionModel.findByIdAndDelete(id);
        if(!transaction)
            return res.status(404).json({
                message : "Transaction not found !",
                data : transaction
            });
        res.json(transaction)
    }catch(err){
        res.status(500).json({
            message : err.message || "Internal server error.",
        })
    }
}

export const getTransaction = async (req,res) => {
    try{
        const {id} = req.user;
        const transactions = await TransactionModel.find({userId:id});
        res.json(transactions);
    }catch(err){
        res.status(500).json({
            message : err.message || "Internal server error.",
        })
    }
}

export default {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction
};