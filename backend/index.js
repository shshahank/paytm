// Backend

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database");
const app = express();

const port = 3000;

// Add cors
app.use(cors());

// Connect to DB
connectDB();

// Add body parser
app.use(express.json());

// Import main router
const { router : mainRouter } = require("./routes/mainRouter");
const { connect } = require("mongoose");

app.use("/api/v1", mainRouter);

// Handle unknow route
app.use((req, res) => {
    res.status(404).json({
        msg : "Route not found :("
    });
});

// Global error catcher
app.use((err, req, res, next) => {
    res.status(500).json({
        msg : "Something's up with our backend :("
    });
})

app.listen(port, () => {
    console.log("App listening on port : " + port);
});