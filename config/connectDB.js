const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = "mongodb://localhost:27017/appMingle";
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
  }
};

connectDB();
