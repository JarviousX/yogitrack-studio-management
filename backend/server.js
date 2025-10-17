const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
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

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory (where index.html is located)
app.use(express.static('../'));

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
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler: send back index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
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
