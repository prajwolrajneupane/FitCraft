import express from "express";
//handles backend
import mongoose from "mongoose";
// gives simpler syntax to work with mongodb
import cors from "cors";
// front and back lai communicate garauna
import dotenv from "dotenv";

// dotenv le path harlai euta thau ma rakhna
import multer from "multer";
// image uploads haru handle garxa
import _ from "lodash";
// library ho jasle chai math ko kura haru easily dinxa

import ApprovedDesignModel from "./models/ApprovedDesign.model.js";
// hami sanga va models haru ya bata import vairako hun
import authRoutes from "./routes/auth.js";
// tyo login signin ko lagi chaine haru aairako xa auth bata
import verifyToken from "./middleware/verifyToken.js";
//user good hoki haina vanera euta token generate hunxa that token is coming from this middleware
import Shirt from "./models/Shirt.model.js";
// har shirt ko property ya bata aauxa
dotenv.config();
//env use garda this ta garnai parxa
const app = express();
// express intitialize gareko ho yo chai
// ---------- MIDDLEWARE ----------
app.use(cors());
//jun sukai port ma pani communicate huna sakos vanera we are not passing any parametes to cors

app.use(express.json());
//dont know
app.use("/uploads", express.static("uploads"));
//yo chai hamro uploads haru yeta gayera basun vanera lekheko this is compulsary
// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);

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
// ekxin ma

// ---------- MULTER SETUP ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ---------- SAVE MODEL + SHIRT ----------
app.post("/api/save", verifyToken, upload.single("model"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

    // Save in User collection
    req.mula.models.push({
      model: req.file.filename,
      modelName: metadata.modelName || null,
    });
    await req.mula.save();

    // Save in Shirt collection (now with category)
    const newShirt = new Shirt({
      userId: req.mula._id,
      modelUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      designName: metadata.designName || "Untitled Design",
      shirtColor: metadata.shirtColor || "unknown",
      category: metadata.category || "tshirt", // default category
      hasText: metadata.hasText || false,
      hasImage: metadata.hasImage || false,
      handdrawn: metadata.handdrawn || false,
      dominantColors: metadata.dominantColors || [],
      designComplexity: metadata.designComplexity || 1,
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

// ---------- UPDATE LATEST MODEL NAME ----------
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

// ---------- APPROVE DESIGN ----------
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

// ---------- FETCH APPROVED DESIGNS ----------
app.get("/api/approved", async (req, res) => {
  try {
    const designs = await ApprovedDesignModel.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching approved designs" });
  }
});

function vectorize(shirt, allColors, allCategories) {
  const binaryVector = [
    shirt.hasText ? 1 : 0,
    shirt.hasImage ? 1 : 0,
    shirt.handdrawn ? 1 : 0,
  ];
  const colorVector = allColors.map((c) => (shirt.shirtColor === c ? 1 : 0));
  const complexityVector = [shirt.designComplexity / 10];
  const dominantVector = allColors.map((c) =>
    shirt.dominantColors.includes(c) ? 1 : 0
  );
  const categoryVector = allCategories.map((cat) =>
    shirt.category === cat ? 1 : 0
  );

  return [
    ...binaryVector,
    ...colorVector,
    ...complexityVector,
    ...dominantVector,
    ...categoryVector,
  ];
}

function cosineSimilarity(x, y) {
  const dot = _.sum(x.map((val, idx) => val * y[idx]));
  const normX = Math.sqrt(_.sum(x.map((val) => val * val)));
  const normY = Math.sqrt(_.sum(y.map((val) => val * val)));
  return dot / (normX * normY + 1e-10);
}

app.get("/api/recommendations", verifyToken, async (req, res) => {
  try {
    const allShirts = await Shirt.find();
    const userShirts = await Shirt.find({ userId: req.mula._id });

    if (!userShirts.length) {
      return res
        .status(200)
        .json({ designs: [], message: "No user designs yet." });
    }

    const latestDesign = userShirts[userShirts.length - 1];

    const allColors = _.uniq(
      allShirts.flatMap((s) => [s.shirtColor, ...(s.dominantColors || [])])
    );
    const allCategories = _.uniq(allShirts.map((s) => s.category));

    const latestVector = vectorize(latestDesign, allColors, allCategories);

    const recommended = allShirts
      .filter((shirt) => !shirt.userId.equals(req.mula._id))
      .map((shirt) => ({
        shirt,
        similarity: cosineSimilarity(
          latestVector,
          vectorize(shirt, allColors, allCategories)
        ),
      }))
      .filter((item) => item.similarity >= 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .map((item) => item.shirt);

    res.status(200).json({
      designs: recommended,
      message: recommended.length
        ? "Here are your personalized recommendations!"
        : "No recommendations found.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("hello?"));
