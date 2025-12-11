// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB bağlantısı kuruldu: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Err: ${error.message}`);
    process.exit(1); // Hata durumunda  kapat
  }
};

module.exports = connectDB;