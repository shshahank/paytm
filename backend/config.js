require("dotenv").config(); // Load the .env file only once

DB_URL = process.env.DB_URL;
JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    DB_URL, JWT_SECRET
}