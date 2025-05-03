const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/IMS";
require('dotenv').config(); // Load environment variables

const DB = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(DB);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongo;
