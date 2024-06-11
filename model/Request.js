import mongoose from "mongoose";

// Define the schema for the Request document
const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
});

// Create and export the Request model
const Request = mongoose.model("Request", requestSchema);
export default Request;
