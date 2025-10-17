const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Your MongoDB Atlas connection string
    let mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackson24le_db_user:NKyPanxvAVPYnox9@yogitrack.4cr0alt.mongodb.net/yogitrack?retryWrites=true&w=majority&appName=YogiTrack';
    
    // Clean the connection string
    mongoURI = mongoURI.trim();
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('MongoDB URI length:', mongoURI.length);
    console.log('MongoDB URI starts with:', mongoURI.substring(0, 20));
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
    console.log('Continuing without database connection...');
    // Don't exit the process - let the app run without database
  }
};

module.exports = connectDB;
