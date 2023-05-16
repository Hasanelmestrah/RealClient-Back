const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()
mongoose.set("strictQuery", true);
module.exports = async function connection() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to database");
    } catch (error) {
        console.log(error);
        console.log("ERROR! Could not connect to database");
        process.exit(1)
    }
};