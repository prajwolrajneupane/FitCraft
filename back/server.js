import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import signatureRouter from "./routes/signature.js";
import statusRouter from "./routes/statusCheck.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/generate-signature", signatureRouter);
app.use("/api/status-check", statusRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
