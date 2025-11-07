// models/Shirt.js
import mongoose from "mongoose";

const ShirtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  modelUrl: { type: String, required: true }, // saved file path/url
  designName: String,
  shirtColor: String, // hex or color name from frontend
  hasText: { type: Boolean, default: false },
  hasImage: { type: Boolean, default: false },
  designComplexity: { type: Number, default: 0 }, // small number representing complexity
  tags: [String], // small list of tags like ["text","graphic","handdrawn"]
  createdAt: { type: Date, default: Date.now },
});

const Shirt = mongoose.models.Shirt || mongoose.model("Shirt", ShirtSchema);
export default Shirt;
