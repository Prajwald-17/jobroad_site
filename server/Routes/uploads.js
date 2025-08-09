// routes/upload.js
import express from "express";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { getDb } from "../db.js"; // your Mongo connection helper

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const db = getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(200).json({
        message: "File uploaded successfully",
        fileId: uploadStream.id,
      });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
