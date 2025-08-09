// db.js
import mongoose from "mongoose";

export function getDb() {
  return mongoose.connection.db;
}