const mongoose = require("mongoose");
require("dotenv").config()


const MONGODB_URL = process.env.MONGODB_URL

/**
 * @description This function connects to the database
 * @example
 * connectToDb()
 * // returns 'a1b2c3d4e5'
 * @throws Will throw an error if the database is not connected
 * @throws Will throw an error if the database is not present
 * @throws Will throw an error if the database is not active
 * @throws Will throw an error if the database is not yet valid
 * @throws Will throw an error if the database is not yet active
 */
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