import mongoose from "mongoose";

const ShirtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modelUrl: { type: String, required: true },
    designName: { type: String },
    shirtColor: { type: String, default: "unknown" },
    category: { type: String, default: "tshirt" }, // ✅ new field
    hasText: { type: Boolean, default: false },
    hasImage: { type: Boolean, default: false },
    handdrawn: { type: Boolean, default: false },
    dominantColors: { type: [String], default: [] },
    designComplexity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Shirt", ShirtSchema);
