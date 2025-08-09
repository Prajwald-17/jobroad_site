import express from "express";
import Job from "../models/job.js";

const router = express.Router();

// GET all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// POST new job (admin)
router.post("/", async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.status(201).json(job);
});

// PUT update job
router.put("/:id", async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedJob);
});

// DELETE job
router.delete("/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});

export default router;
