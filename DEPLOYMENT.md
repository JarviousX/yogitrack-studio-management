# Deployment Guide for YogiTrack

## 🚀 GitHub Upload

### Step 1: Initialize Git Repository
```bash
cd /Users/jarvious/Yogitrack_Final
git init
```

### Step 2: Add All Files (except those in .gitignore)
```bash
git add .
```

### Step 3: Create Initial Commit
```bash
git commit -m "Initial commit: YogiTrack yoga studio management system"
```

### Step 4: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it: `yogitrack-studio-management`
4. Make it Public (or Private if you prefer)
5. Don't initialize with README (we already have one)

### Step 5: Connect and Push to GitHub
```bash
git remote add origin https://github.com/JarviousX/yogitrack-studio-management.git
git branch -M main
git push -u origin main
```

## 🌐 Heroku Deployment

### Step 1: Install Heroku CLI
- Download from: https://devcenter.heroku.com/articles/heroku-cli
- Or install via Homebrew: `brew install heroku/brew/heroku`

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
heroku create your-app-name-here
```
*Replace `your-app-name-here` with your desired app name*

### Step 4: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
```

### Step 5: Deploy to Heroku
```bash
git push heroku main
```

### Step 6: Open Your App
```bash
heroku open
```

## 🔐 Security Checklist

### ✅ Files Protected by .gitignore:
- `.env` file (contains MongoDB connection string)
- `node_modules/` (dependencies)
- Log files and temporary files

### ✅ Environment Variables Set on Heroku:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `PORT` - Automatically set by Heroku

### ✅ What's Safe to Commit:
- All source code files
- `package.json` files
- `README.md`
- `Procfile`
- `.gitignore`
- All HTML, CSS, and JavaScript files

## 📁 Essential Files for Deployment

### Must Have:
1. `package.json` (root) - Defines the project and dependencies
2. `Procfile` - Tells Heroku how to start your app
3. `backend/server.js` - Your main server file
4. `backend/package.json` - Backend dependencies
5. `index.html` - Your main frontend file
6. `styles.css` - Your styling
7. `script.js` - Your frontend JavaScript
8. All model files in `backend/models/`
9. All route files in `backend/routes/`
10. `backend/config/database.js` - Database configuration

### Optional but Recommended:
- `README.md` - Project documentation
- `.gitignore` - Protects sensitive files
- `DEPLOYMENT.md` - This deployment guide

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails on Heroku**
   - Check that all dependencies are in `package.json`
   - Ensure `Procfile` is in the root directory

2. **App Crashes on Heroku**
   - Check logs: `heroku logs --tail`
   - Verify MongoDB connection string is set correctly

3. **Static Files Not Loading**
   - Ensure `index.html` is in the root directory
   - Check that file paths are correct

4. **Database Connection Issues**
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Check that the connection string is correct

### Useful Commands:
```bash
# Check Heroku logs
heroku logs --tail

# Check environment variables
heroku config

# Restart the app
heroku restart

# Open the app
heroku open
```

## 🎉 Success!

Once deployed, your YogiTrack app will be live on the internet at:
`https://your-app-name-here.herokuapp.com`

You can share this URL with anyone to showcase your project!
