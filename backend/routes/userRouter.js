const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config");
const { validateSignup, validateSignin, validateUpdateInfo, authMiddleware } = require("../middlewares/middlewares");
const { User, Account } = require("../database");

const router = express.Router();

// User signup route
router.post("/signup", validateSignup, async function(req, res) {
    const payload = req.body;

    try {
        // Check if user already exists
        const user = await User.findOne({
            username : payload.username
        }).lean();

        if(user) {
            return res.status(400).json({
                msg : "The username is already taken :("
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const dbUser = await User.create({
            username: payload.username,
            password: hashedPassword,
            first_name: payload.first_name,
            last_name: payload.last_name
        });

        const token = jwt.sign({
            userId : dbUser._id
        }, JWT_SECRET);

        // Initialize balances on signup
        await Account.create({
            userId : dbUser._id,
            balance : 1 + Math.random() * 10000
        });

        res.status(201).json({
            msg : "User created succesfully :)",
            token : token
        });

    } catch(err) {
        res.status(400).json({
            msg : "Something went wrong while signup :("
        });
        console.error(err);
    }
});


// user signin route
router.post("/signin", validateSignin, async function(req, res) {
    const payload = req.body;

    const user = await User.findOne({
        username : payload.username
    });

    if(!user) {
        return res.status(400).json({
            msg : "User Not found :("
        });
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    
    if(!isMatch) {
        return res.status(400).json({
            msg : "Wrong Password :("
        });
    }

    const token = jwt.sign({
        userId : user._id
    }, JWT_SECRET);

    res.status(200).json({
        token : token
    });
})

// Update info route
router.put("/update", authMiddleware, validateUpdateInfo, async function(req, res) {
    const updatePayload = req.body;
    const userId = req.userId;
    try {
        // If password is being updated → hash it
        if (updatePayload.password) {
            updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
        }

        await User.updateOne({ _id: userId }, updatePayload);

        return res.status(202).json({
            msg: "User info updated successfully :)"
        });
    } catch(err) {
        res.status(500).json({
            msg : "Something went wrong while updation :("
        });
    }
})

router.get("/bulk", async function(req, res) {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            first_name : { $regex : filter }
        }, {
            last_name : { $regex : filter }
        }]
    });

    res.json({
        users : users.map((user) => ({
            username : user.username,
            first_name : user.first_name,
            last_name : user.last_name,
            _id : user._id
        }))
    });
})

module.exports = {
    router
}