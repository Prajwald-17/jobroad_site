// api/index.js - Main serverless function entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Import models
import Job from "../models/job.js";
import Application from "../models/Application.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://jobroad-site.vercel.app',
    'https://jobroad-site-prajwald-17s-projects.vercel.app',
    /^https:\/\/jobroad-site.*\.vercel\.app$/,
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection with caching for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI not set in environment variables");
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    cachedConnection = connection;
    console.log("MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Root route - API status
app.get("/", (req, res) => {
  res.json({
    message: "Job Site API is running!",
    version: "1.0.0",
    endpoints: {
      jobs: "/jobs",
      applications: "/applications"
    },
    status: "healthy"
  });
});

// GET /jobs - list all jobs
app.get("/jobs", async (req, res) => {
  try {
    await connectToDatabase();
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs", details: err.message });
  }
});

// GET /jobs/:id - get a specific job
app.get("/jobs/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ error: "Failed to fetch job", details: err.message });
  }
});

// POST /jobs - add a job
app.post("/jobs", async (req, res) => {
  try {
    await connectToDatabase();
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(400).json({ error: "Failed to create job", details: err.message });
  }
});

// PUT /jobs/:id - update a job
app.put("/jobs/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(400).json({ error: "Failed to update job", details: err.message });
  }
});

// DELETE /jobs/:id - delete a job
app.delete("/jobs/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Also delete related applications
    await Application.deleteMany({ jobId: req.params.id });
    
    res.json({ message: "Job and related applications deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Failed to delete job", details: err.message });
  }
});

// POST /jobs/:id/apply - simplified application (no file upload for now)
app.post("/jobs/:id/apply", async (req, res) => {
  try {
    await connectToDatabase();
    const jobId = req.params.id;
    const { name, email, resumeUrl } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const applicationData = {
      jobId,
      name,
      email,
      resumeUrl: resumeUrl || null
    };

    const appDoc = await Application.create(applicationData);
    res.status(201).json({ message: "Application saved", application: appDoc });
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /applications - list all applications
app.get("/applications", async (req, res) => {
  try {
    await connectToDatabase();
    const apps = await Application.find().sort({ createdAt: -1 }).populate("jobId");
    res.json(apps);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications", details: err.message });
  }
});

// Export for Vercel serverless
export default app;