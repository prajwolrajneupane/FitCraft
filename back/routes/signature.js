import express from "express";
import { generateSignature } from "../utils/generateSignature.js";

const router = express.Router();

// API to generate signature
router.post("/", (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;
  if (!total_amount || !transaction_uuid || !product_code)
    return res.status(400).json({ error: "Missing required fields" });

  const signature = generateSignature(
    total_amount,
    transaction_uuid,
    product_code
  );

  res.json({
    signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    form_url: process.env.ESEWA_UAT_FORM_URL,
    product_code: process.env.ESEWA_PRODUCT_CODE,
  });
});

export default router;
