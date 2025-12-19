const express = require("express");

const router = express.Router(); // main router
const { router : userRouter } = require("./userRouter");
const { router : accountRouter } = require("./accountRouter");

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = {
    router
}