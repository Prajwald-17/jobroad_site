# Job Site - Full Stack Web Application

A modern job board application built with React, Node.js, Express, and MongoDB. Features job listings, application management, file uploads, and a comprehensive admin dashboard.

## 🚀 Features

- **Job Listings**: Browse available positions with detailed information
- **Job Applications**: Apply with resume upload or URL submission
- **Admin Dashboard**: Complete CRUD operations for job management
- **File Upload**: PDF resume upload with GridFS storage
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: All changes instantly reflect in the database

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library for building user interfaces
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **GridFS** - File storage system for MongoDB
- **Multer** - Middleware for handling file uploads
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **npm** - Package manager
- **nodemon** - Development server auto-restart
- **create-react-app** - React application boilerplate

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job_site
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
# Create a .env file in the server directory with the following content:
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/job_site?retryWrites=true&w=majority
PORT=5000

# Start the server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

### 4. Database Configuration

#### Option A: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGO_URI` in your `.env` file

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGO_URI` to: `mongodb://localhost:27017/job_site`

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Job Listings**: http://localhost:3000/jobs
- **Admin Dashboard**: http://localhost:3000/admin

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Jobs Endpoints

#### Get All Jobs
```http
GET /jobs
```
**Response:**
```json
[
  {
    "_id": "64f7b1234567890abcdef123",
    "title": "Frontend Developer",
    "company": "TechCorp Inc.",
    "location": "New York, NY",
    "description": "We are looking for a skilled Frontend Developer...",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "__v": 0
  }
]
```

#### Get Job by ID
```http
GET /jobs/:id
```
**Response:**
```json
{
  "_id": "64f7b1234567890abcdef123",
  "title": "Frontend Developer",
  "company": "TechCorp Inc.",
  "location": "New York, NY",
  "description": "We are looking for a skilled Frontend Developer...",
  "createdAt": "2023-09-05T10:30:00.000Z",
  "__v": 0
}
```

#### Create New Job
```http
POST /jobs
Content-Type: application/json

{
  "title": "Backend Developer",
  "company": "DataSoft Solutions",
  "location": "San Francisco, CA",
  "description": "Join our backend team to build scalable APIs..."
}
```

#### Update Job
```http
PUT /jobs/:id
Content-Type: application/json

{
  "title": "Senior Backend Developer",
  "company": "DataSoft Solutions",
  "location": "San Francisco, CA",
  "description": "Lead our backend team to build scalable APIs..."
}
```

#### Delete Job
```http
DELETE /jobs/:id
```
**Response:**
```json
{
  "message": "Job and related applications deleted successfully"
}
```

### Applications Endpoints

#### Apply for Job
```http
POST /jobs/:id/apply
Content-Type: multipart/form-data

# Form Data:
name: "John Doe"
email: "john.doe@example.com"
resume: [PDF file] (optional)
resumeUrl: "https://example.com/resume.pdf" (optional)
```

#### Get All Applications
```http
GET /applications
```
**Response:**
```json
[
  {
    "_id": "64f7b1234567890abcdef456",
    "jobId": {
      "_id": "64f7b1234567890abcdef123",
      "title": "Frontend Developer",
      "company": "TechCorp Inc.",
      "location": "New York, NY",
      "description": "We are looking for a skilled Frontend Developer...",
      "createdAt": "2023-09-05T10:30:00.000Z",
      "__v": 0
    },
    "name": "John Doe",
    "email": "john.doe@example.com",
    "resumeUrl": "https://example.com/resume.pdf",
    "createdAt": "2023-09-05T11:00:00.000Z",
    "__v": 0
  }
]
```

#### Download Resume File
```http
GET /resumes/:fileId
```
Returns the PDF file for download.

### File Upload Endpoints

#### Upload File
```http
POST /upload
Content-Type: multipart/form-data

file: [PDF file]
```

## 🗂️ Project Structure

```
job_site/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Navbar.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── JobList.js
│   │   │   ├── JobDetails.js
│   │   │   ├── ApplyForm.js
│   │   │   └── Admin.js
│   │   ├── api.js          # API functions
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   │   ├── Job.js
│   │   └── Application.js
│   ├── Routes/             # API routes
│   │   └── uploads.js
│   ├── server.js           # Main server file
│   ├── db.js              # Database connection
│   ├── package.json
│   └── .env               # Environment variables
└── README.md
```

## 🎯 Usage Guide

### For Job Seekers
1. Visit http://localhost:3000/jobs
2. Browse available job listings
3. Click "Apply Now" on desired positions
4. Fill out the application form
5. Upload resume (PDF) or provide resume URL
6. Submit application

### For Administrators
1. Visit http://localhost:3000/admin
2. **Manage Jobs:**
   - View all jobs in a grid layout
   - Click "Add New Job" to create new positions
   - Click "Edit" to modify existing jobs
   - Click "Delete" to remove jobs (with confirmation)
3. **View Applications:**
   - Switch to "Applications" tab
   - View all submitted applications
   - Access resume files and URLs
   - See application statistics

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```bash
cd client
npm start    # React development server with hot reload
```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job_site?retryWrites=true&w=majority
PORT=5000
```

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.1",
  "react-scripts": "5.0.1"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.3",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "gridfs-stream": "^1.1.1"
}
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the server directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify your MongoDB URI in the `.env` file
- Check if MongoDB service is running (for local installations)
- Ensure network access is allowed (for MongoDB Atlas)

**Port Already in Use:**
- Change the PORT in `.env` file
- Kill existing processes: `npx kill-port 5000`

**CORS Errors:**
- Ensure the backend server is running
- Check if CORS is properly configured in `server.js`

**File Upload Issues:**
- Verify file size limits (default: 5MB)
- Ensure only PDF files are being uploaded
- Check GridFS configuration

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Node.js, and MongoDB**