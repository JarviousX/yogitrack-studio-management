#!/bin/bash

echo "🚀 Setting up Heroku environment variables..."

# Set MongoDB URI
heroku config:set MONGODB_URI="mongodb+srv://jackson24le_db_user:NKyPanxvAVPYnox9@yogitrack.4cr0alt.mongodb.net/yogitrack?retryWrites=true&w=majority&appName=YogiTrack"

echo "✅ MongoDB URI set successfully!"

# Check current config
echo "📋 Current Heroku config:"
heroku config

echo "🔄 Restarting the app..."
heroku restart

echo "✅ Setup complete! Your app should now connect to MongoDB."
echo "🌐 Check your app at: https://your-app-name.herokuapp.com"
