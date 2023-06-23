const mongoose = require("mongoose");
require("dotenv").config()


const MONGODB_URL = process.env.MONGODB_URL

function connectToDb(){ 

    mongoose.connect(MONGODB_URL);

    mongoose.connection.on('connected', () =>{ 
        console.log("Connected to the database!");
    })

    mongoose.connection.on('error', () => {
        console.log("Error connecting to the database!")
    })
}

module.exports = {connectToDb}; 