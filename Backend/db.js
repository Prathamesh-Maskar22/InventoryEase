const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/IMS";
const DB= "mongodb+srv://maskarprathmesh22:prathamesh@cluster0.diskboq.mongodb.net/IMS?retryWrites=true&w=majority"

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
