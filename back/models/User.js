// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  models: [
    {
      model: String,
      modelName: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  keywords: [String], // ← Add this for recommendation keywords
});

export default mongoose.model("User", UserSchema);
