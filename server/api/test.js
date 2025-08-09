// api/test.js - Simple test endpoint without MongoDB
import express from "express";
import cors from "cors";

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

// Test data
const mockJobs = [
  {
    _id: "1",
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    description: "Looking for a skilled frontend developer...",
    requirements: ["React", "JavaScript", "CSS"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "2", 
    title: "Backend Developer",
    company: "StartupXYZ",
    location: "New York",
    description: "Join our backend team...",
    requirements: ["Node.js", "MongoDB", "Express"],
    createdAt: new Date().toISOString()
  }
];

const mockApplications = [];

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Job Site API is running! (Test Mode)",
    version: "1.0.0-test",
    endpoints: {
      jobs: "/jobs",
      applications: "/applications"
    },
    status: "healthy",
    mode: "test"
  });
});

// GET /jobs
app.get("/jobs", (req, res) => {
  res.json(mockJobs);
});

// GET /jobs/:id
app.get("/jobs/:id", (req, res) => {
  const job = mockJobs.find(j => j._id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

// POST /jobs
app.post("/jobs", (req, res) => {
  const newJob = {
    _id: String(mockJobs.length + 1),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockJobs.push(newJob);
  res.status(201).json(newJob);
});

// PUT /jobs/:id
app.put("/jobs/:id", (req, res) => {
  const index = mockJobs.findIndex(j => j._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  mockJobs[index] = { ...mockJobs[index], ...req.body };
  res.json(mockJobs[index]);
});

// DELETE /jobs/:id
app.delete("/jobs/:id", (req, res) => {
  const index = mockJobs.findIndex(j => j._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  mockJobs.splice(index, 1);
  res.json({ message: "Job deleted successfully" });
});

// POST /jobs/:id/apply
app.post("/jobs/:id/apply", (req, res) => {
  const { name, email, resumeUrl } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const application = {
    _id: String(mockApplications.length + 1),
    jobId: req.params.id,
    name,
    email,
    resumeUrl: resumeUrl || null,
    createdAt: new Date().toISOString()
  };
  
  mockApplications.push(application);
  res.status(201).json({ message: "Application saved", application });
});

// GET /applications
app.get("/applications", (req, res) => {
  res.json(mockApplications);
});

export default app;