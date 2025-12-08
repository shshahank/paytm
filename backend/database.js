const mongo = require("mongoose");
const { DB_URL } = require("./config");

// Connect to the DB
async function connectDB() {
    try {
        await mongo.connect(DB_URL);
        console.log("Backend connected to DB :)");
    } catch(err) {
        console.log("Backend can't connect to Database :(");
        console.error(err);
    }
}

// Mongo DB schema for the users (username, password, first_name, last_name)
const userSchema = mongo.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        minlength : 3,
        maxlength : 20
    },
    
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 6
    },

    first_name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    },

    last_name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    }
});

// Account schema
const accountSchema = mongo.Schema({
    userId : {
        type : mongo.Schema.Types.ObjectId,
        res : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})


// Monog DB users model
const User = mongo.model("User", userSchema);
const Account = mongo.model("Account", accountSchema);

module.exports = {
    connectDB, User, Account, 
}