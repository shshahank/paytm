const express = require("express");

const router = express.Router();
const { router : userRouter } = require("./userRouter");

router.use("/user", userRouter);

module.exports = {
    router
}