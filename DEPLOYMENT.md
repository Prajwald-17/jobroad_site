# Deployment Guide

This guide covers deploying the Job Site application to various platforms.

## 🚀 Vercel Deployment

### Frontend Deployment (Recommended)

1. **Deploy Frontend to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from project root
   cd client
   vercel --prod
   ```

2. **Environment Variables for Frontend:**
   - `REACT_APP_API_URL`: Your backend API URL

### Backend Deployment Options

#### Option 1: Deploy Backend to Vercel
```bash
cd server
vercel --prod
```

#### Option 2: Deploy Backend to Railway/Render
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: 5000 (or leave default)

#### Option 3: Deploy Backend to Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGO_URI="your-mongodb-uri"
git subtree push --prefix server heroku main
```

## 🔧 Environment Variables Setup

### Production Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job_site
PORT=5000
NODE_ENV=production
```

**Frontend (.env.local):**
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
REACT_APP_ENVIRONMENT=production
```

## 📋 Pre-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB database is accessible from production
- [ ] CORS is configured for production domains
- [ ] Build process completes without errors
- [ ] All sensitive data is in environment variables
- [ ] .gitignore includes .env files

## 🌐 Deployment URLs

After deployment, update these URLs in your environment variables:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.vercel.app`

## 🔄 Continuous Deployment

Both Vercel and other platforms support automatic deployment from GitHub:

1. Connect your repository
2. Set up environment variables
3. Configure build settings
4. Enable automatic deployments

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS configuration in server.js
2. **Environment Variables**: Ensure all required variables are set
3. **Build Failures**: Check Node.js version compatibility
4. **Database Connection**: Verify MongoDB URI and network access

### Build Commands:

**Frontend:**
```bash
npm install
npm run build
```

**Backend:**
```bash
npm install
npm start
```

## 📊 Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Optimize images and bundle size
- Enable caching headers
- Monitor performance metrics