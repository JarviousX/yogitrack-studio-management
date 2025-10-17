const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Your MongoDB Atlas connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackson24le_db_user:NKyPanxvAVPYnox9@yogitrack.4cr0alt.mongodb.net/yogitrack?retryWrites=true&w=majority&appName=YogiTrack';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI ? 'Set' : 'Not set');
    
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
