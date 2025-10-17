const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const instructorRoutes = require('./routes/instructors');
const classRoutes = require('./routes/classes');
const customerRoutes = require('./routes/customers');
const packageRoutes = require('./routes/packages');
const saleRoutes = require('./routes/sales');
const attendanceRoutes = require('./routes/attendance');
const reportRoutes = require('./routes/reports');

const app = express();

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  console.log('Server will continue without database connection');
});

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory (where index.html is located)
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/instructors', instructorRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'YogiTrack API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    connection_state: mongoose.connection.readyState,
    env_vars: Object.keys(process.env).filter(key => key.includes('MONGO'))
  });
});

// Test MongoDB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const Instructor = require('./models/Instructor');
    const count = await Instructor.countDocuments();
    res.json({
      success: true,
      message: 'Database connection successful',
      instructorCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Manual connection test endpoint
app.get('/api/connect-db', async (req, res) => {
  try {
    let mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackson24le_db_user:NKyPanxvAVPYnox9@yogitrack.4cr0alt.mongodb.net/yogitrack?retryWrites=true&w=majority&appName=YogiTrack';
    
    // Clean the connection string
    mongoURI = mongoURI.trim();
    
    console.log('Attempting manual connection...');
    console.log('URI exists:', !!process.env.MONGODB_URI);
    console.log('URI length:', mongoURI.length);
    console.log('URI starts with:', mongoURI.substring(0, 20));
    console.log('URI ends with:', mongoURI.substring(mongoURI.length - 20));
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    res.json({
      success: true,
      message: 'Manual connection successful',
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Manual connection failed',
      error: error.message,
      connectionState: mongoose.connection.readyState,
      uriLength: mongoURI ? mongoURI.length : 0,
      uriStart: mongoURI ? mongoURI.substring(0, 20) : 'undefined'
    });
  }
});

// Catch-all handler: send back index.html for any non-API routes
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 YogiTrack API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Instructors API: http://localhost:${PORT}/api/instructors`);
});
