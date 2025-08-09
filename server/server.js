// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Readable } from "stream";
import uploadRoutes from "./Routes/uploads.js";

dotenv.config();

import Job from "./models/job.js";
import Application from "./models/Application.js";

const app = express();
app.use(cors());
app.use(express.json());

// Multer: keep file in memory, we'll pipe to GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit (adjust if needed)
});


app.use("/upload", uploadRoutes);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => { console.error(err); process.exit(1); });

// Helper to get GridFSBucket (after connection)
function getBucket() {
  const db = mongoose.connection.db;
  return new mongoose.mongo.GridFSBucket(db, { bucketName: "resumes" });
}

/* ------------------- Jobs CRUD (simple) ------------------- */

// GET /jobs - list all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET /jobs/:id - get a specific job
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST /jobs - add a job (for admin/dev testing)
app.post("/jobs", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create job" });
  }
});

// PUT /jobs/:id - update a job
app.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update job" });
  }
});

// DELETE /jobs/:id - delete a job
app.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Also delete related applications
    await Application.deleteMany({ jobId: req.params.id });
    
    res.json({ message: "Job and related applications deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

/* ------------------- Apply (upload PDF to GridFS) ------------------- */
/*
  Frontend must send FormData with fields:
    name
    email
    resume (file input, accept=application/pdf)
*/

app.post("/jobs/:id/apply", upload.single("resume"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const { name, email, resumeUrl } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if either file or URL is provided
    if (!req.file && !resumeUrl) {
      return res.status(400).json({ error: "Either resume file or resume URL is required" });
    }

    let applicationData = {
      jobId,
      name,
      email
    };

    // Handle file upload
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      // Save file to GridFS
      const bucket = getBucket();
      const readable = Readable.from(req.file.buffer);
      const uploadStream = bucket.openUploadStream(`${Date.now()}-resume.pdf`, {
        contentType: req.file.mimetype,
        metadata: {
          originalname: req.file.originalname,
          uploadedBy: email
        }
      });

      readable.pipe(uploadStream)
        .on("error", (err) => {
          console.error("GridFS upload error:", err);
          return res.status(500).json({ error: "Failed to store resume" });
        })
        .on("finish", async () => {
          // Create application record with file ID
          applicationData.resumeFileId = uploadStream.id;
          const appDoc = await Application.create(applicationData);
          res.status(201).json({ message: "Application saved", application: appDoc });
        });
    } else {
      // Handle resume URL
      applicationData.resumeUrl = resumeUrl;
      const appDoc = await Application.create(applicationData);
      res.status(201).json({ message: "Application saved", application: appDoc });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------- Download resume by fileId ------------------- */
// GET /resumes/:fileId
app.get("/resumes/:fileId", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const bucket = getBucket();

    // find file metadata
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    const fileDoc = files[0];

    res.setHeader("Content-Type", fileDoc.contentType || "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileDoc.filename}"`);

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
    downloadStream.on("error", (err) => {
      console.error("GridFS download error", err);
      res.sendStatus(500);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid file id" });
  }
});

/* ------------------- Serve application list for testing ------------------- */
// GET /applications (list all)
app.get("/applications", async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 }).populate("jobId");
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
