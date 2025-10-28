import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import ApprovedDesignModel from "./models/ApprovedDesign.model.js";
// eSewa import
import { generateSignature } from "./routes/utils/generateSignature.js";

import authRoutes from "./routes/auth.js";
import User from "./models/User.js";
import verifyToken from "./middleware/verifyToken.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Auth routes
app.use("/api/auth", authRoutes);

//  Get user profile (token protected)
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    res.json({
      name: req.mula.name,
      email: req.mula.email,
      models: req.mula.models || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Multer for .glb uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Save uploaded model to user's record
app.post("/api/save", verifyToken, upload.single("model"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    req.mula.models.push({
      model: req.file.filename,
      modelName: null,
    });

    await req.mula.save();

    res.status(200).json({
      message: "Model uploaded and saved to user",
      model: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update latest model name
app.post("/api/update-latest-model-name", verifyToken, async (req, res) => {
  const { modelName } = req.body;

  try {
    const latestModel = req.mula.models[req.mula.models.length - 1];
    if (!latestModel) {
      return res.status(404).json({ message: "No model found for user" });
    }

    latestModel.modelName = modelName;
    await req.mula.save();

    res.status(200).json({ message: "Model name updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/approved", async (req, res) => {
  const { userId, designName, modelUrl, thumbnailUrl } = req.body;
  try {
    const model = await ApprovedDesignModel.create({
      userId,
      designName,
      modelUrl,
      thumbnailUrl,
    });
    res.status(200).json({ message: "Design approved", model });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving approved design" });
  }
});

// Get all approved designs
app.get("/api/approved", async (req, res) => {
  try {
    const designs = await ApprovedDesignModel.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching approved designs" });
  }
});

app.post("/api/generate-signature", (req, res) => {
  try {
    const {
      amount,
      tax_amount,
      product_service_charge,
      product_delivery_charge,
      total_amount,
      transaction_uuid,
      product_code,
    } = req.body;

    const signature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      amount,
      tax_amount,
      product_service_charge,
      product_delivery_charge
    );

    res.json({
      form_url: process.env.ESEWA_UAT_FORM_URL,
      signed_field_names:
        "total_amount,transaction_uuid,product_code,amount,tax_amount,product_service_charge,product_delivery_charge",
      signature,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating signature" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello?");
});
