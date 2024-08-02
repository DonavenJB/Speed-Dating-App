const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('[db.js] Starting MongoDB connection process...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[db.js] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[db.js] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
