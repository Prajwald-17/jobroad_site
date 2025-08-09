import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

router.post("/:jobId", async (req, res) => {
  const { name, email, resumeUrl } = req.body;
  const application = new Application({ jobId: req.params.jobId, name, email, resumeUrl });
  await application.save();
  res.status(201).json(application);
});

export default router;

