# MongoDB Setup Guide for YogiTrack

## 🚀 Quick Start

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update the connection string in `backend/config/database.js`

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The default connection string `mongodb://localhost:27017/yogitrack` will work

## 📋 Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yogitrack?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Backend Server
```bash
npm run dev
```

### 4. Test the API
Visit: `http://localhost:5000/api/health`

## 🔧 API Endpoints

### Instructors
- `GET /api/instructors` - Get all instructors
- `POST /api/instructors` - Create new instructor
- `GET /api/instructors/:id` - Get single instructor
- `PUT /api/instructors/:id` - Update instructor
- `DELETE /api/instructors/:id` - Delete instructor
- `GET /api/instructors/stats/overview` - Get instructor statistics

## 📊 Database Schema

### Instructor Model
```javascript
{
  instructorId: "I00123", // Auto-generated
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah@yogahom.com",
  phone: "(555) 123-4567",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102"
  },
  preferredCommunication: "email",
  specialties: ["Hatha", "Vinyasa"],
  payRate: 50.00,
  status: "active",
  bio: "Experienced yoga instructor...",
  emergencyContact: {
    name: "John Johnson",
    relationship: "Spouse",
    phone: "(555) 987-6543"
  }
}
```

## 🛠️ Development Tips

1. **MongoDB Compass**: Use MongoDB Compass to visualize your data
2. **Postman**: Test API endpoints with Postman
3. **Environment Variables**: Never commit `.env` files to version control
4. **Error Handling**: Check console logs for database connection issues

## 🔒 Security Notes

- Change default JWT secret in production
- Use environment variables for sensitive data
- Enable MongoDB authentication
- Use HTTPS in production

## 📱 Frontend Integration

The frontend form is ready to connect to the backend API. To enable real API calls:

1. Update the `handleInstructorFormSubmit` function in `script.js`
2. Replace the `simulateApiCall()` with actual fetch requests
3. Add error handling for network issues

## 🆘 Troubleshooting

### Common Issues:
1. **Connection refused**: Check if MongoDB is running
2. **Authentication failed**: Verify username/password in connection string
3. **Network timeout**: Check firewall settings and network connectivity
4. **CORS errors**: Ensure frontend URL is in CORS configuration

### Getting Help:
- Check MongoDB Atlas logs
- Review server console output
- Test API endpoints with Postman
- Verify environment variables are loaded correctly
