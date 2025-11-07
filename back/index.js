import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";

import ApprovedDesignModel from "./models/ApprovedDesign.model.js";
import { generateSignature } from "./routes/utils/generateSignature.js";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js";
import verifyToken from "./middleware/verifyToken.js";
import Shirt from "./models/Shirt.model.js"; // ✅ added for recommendations

dotenv.config();
const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);

// ✅ Protected route: get user profile
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Save uploaded model to user's record + Shirt model for recommendations
app.post("/api/save", verifyToken, upload.single("model"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Metadata from frontend (optional)
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

    // Save in user collection
    req.mula.models.push({
      model: req.file.filename,
      modelName: metadata.modelName || null,
    });
    await req.mula.save();

    // Save in Shirt model (for recommendation system)
    const newShirt = new Shirt({
      userId: req.mula._id,
      modelUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      designName: metadata.designName || "Untitled Design",
      shirtColor: metadata.shirtColor || "unknown",
      hasText: metadata.hasText || false,
      hasImage: metadata.hasImage || false,
      dominantColors: metadata.dominantColors || [],
      designComplexity: metadata.designComplexity || 1,
      tags: metadata.tags || [],
    });

    await newShirt.save();

    res.status(200).json({
      message: "Model uploaded, saved to user and recommendation DB",
      model: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update latest model name
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

// ✅ Approve and save design
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

// ✅ Fetch all approved designs
app.get("/api/approved", async (req, res) => {
  try {
    const designs = await ApprovedDesignModel.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching approved designs" });
  }
});

// ✅ Esewa signature route
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

app.get("/api/recommendations", verifyToken, async (req, res) => {
  console.log("✅ Reached recommendations route");
  console.log("req.mula:", req.mula); // Should print user data

  try {
    const allShirts = await Shirt.find();
    const userShirts = await Shirt.find({ userId: req.mula._id });

    console.log("User shirts count:", userShirts.length);

    if (userShirts.length === 0) {
      console.log("❌ No user shirts found");
      return res.status(200).json({
        designs: [],
        message: "You have no designs yet for attribute-based recommendations.",
      });
    }

    const latestDesign = userShirts[userShirts.length - 1];
    console.log("Latest design:", latestDesign._id);

    const recommended = allShirts.filter((shirt) => {
      if (shirt.userId.equals(req.mula._id)) return false;
      const textMatch = shirt.hasText === latestDesign.hasText;
      const imageMatch = shirt.hasImage === latestDesign.hasImage;
      const handdrawnMatch = shirt.handdrawn === latestDesign.handdrawn;
      const colorMatch = shirt.shirtColor === latestDesign.shirtColor;
      const complexityMatch =
        Math.abs(shirt.designComplexity - latestDesign.designComplexity) <= 1;

      const matchCount = [
        textMatch,
        imageMatch,
        handdrawnMatch,
        colorMatch,
        complexityMatch,
      ].filter(Boolean).length;

      return matchCount >= 2;
    });

    console.log("Recommended designs count:", recommended.length);

    res.status(200).json({
      designs: recommended,
      message: recommended.length
        ? "Here are your personalized recommendations!"
        : "No recommendations found.",
    });
  } catch (err) {
    console.error("Server error in /recommendations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- DATABASE CONNECTION ----------
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

app.post("/api/user/keywords", verifyToken, async (req, res) => {
  const { keywords } = req.body; // ["black", "hoodie"]
  try {
    req.mula.keywords = req.mula.keywords || [];
    req.mula.keywords.push(...keywords);
    // Remove duplicates
    req.mula.keywords = [...new Set(req.mula.keywords)];
    console.log("req.mula:", req.mula);
    await req.mula.save();
    res.status(200).json({ message: "Keywords saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
