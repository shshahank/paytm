const express = require("express");
const { authMiddleware } = require("../middlewares/middlewares");
const { Account } = require("../database");
const mongo = require("mongoose");
const router = express.Router();

// Check the balance of the user
router.get("/balance", authMiddleware, async function (req, res) {

    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(400).json({
                msg: "Something went wrong :("
            })
        }
    
        res.json({
            balance: account.balance
        });
    } catch(err) {
        console.error("Error : " + err);
        return res.status(500).json({
            msg : "Something's up with backend :("
        });
    }
});

// Transfer the money
router.post("/transfer", authMiddleware, async function (req, res) {
    // Create a session
    const session = await mongo.startSession();

    try {
        // Input validation
        const { sendTo, amount } = req.body;

        if (!sendTo || !amount) {
            return res.status(400).json({
                msg: "Inputs are missing :("
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                msg: "Transfer amount must be greater than zero"
            });
        }

        // Start a transacation
        session.startTransaction();

        // Get the sender's account and check for balance

        const senderAccount = await Account.findOne({
            userId : req.userId
        }).session(session);

        if(!senderAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                msg : "Invalid Account"
            })
        }

        if(senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                msg : "Insufficient balance :("
            });
        }

        // Get the receiver's  account
        const sendToAccount = await Account.findOne({
            userId : sendTo
        }).session(session);

        if(!sendToAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                msg : "User not found :("
            });
        }

        // Perform the transaction
        await Account.updateOne({ userId : req.userId }, {
            $inc : { balance : -amount }
        }).session(session);

        await Account.updateOne({ userId : sendTo }, {
            $inc : { balance : amount }
        }).session(session);

        // commit transaction
        await session.commitTransaction();

        res.status(200).json({
            msg : "Transaction Successfull :)"
        });

    } catch (err) {
        await session.abortTransaction();
        console.error("Transaction error in transfer : " + err);

        return res.status(500).json({
            msg : "Transaction failed :("
        })
    } finally {
        // always end the session
        session.endSession();
    }
});

module.exports = {
    router
}