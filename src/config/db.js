const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;

  await mongoose.connect(mongoUrl);

  console.log("Database connection established");
};

module.exports = connectDB;