import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeFileId: mongoose.Schema.Types.ObjectId, // GridFS file id (for uploaded files)
  resumeUrl: String, // URL to resume (alternative to file upload)
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Application", applicationSchema);
