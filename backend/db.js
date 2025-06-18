const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect("mongodb+srv://ashwin202507:Aezakmi@cluster0.widkw5n.mongodb.net/mydb2");
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};


connectDB();
module.exports = connectDB;
