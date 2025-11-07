// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  models: [
    {
      model: String,
      modelName: String,
    },
  ],
  keywords: [String], // ← Add this for recommendation keywords
});

export default mongoose.model("User", UserSchema);
