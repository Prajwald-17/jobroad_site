import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);
