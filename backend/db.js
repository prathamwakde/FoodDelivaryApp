const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/FoodDelivaryApp");
    console.log("✅ Connected to Mongo Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = connectToMongo;