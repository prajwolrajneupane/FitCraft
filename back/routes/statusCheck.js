import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Optional: verify transaction status if user closes browser
router.get("/", async (req, res) => {
  const { product_code, total_amount, transaction_uuid } = req.query;
  if (!product_code || !total_amount || !transaction_uuid)
    return res.status(400).json({ error: "Missing query params" });

  const url = `${
    process.env.ESEWA_UAT_STATUS
  }?product_code=${encodeURIComponent(
    product_code
  )}&total_amount=${encodeURIComponent(
    total_amount
  )}&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Status check failed", details: err.message });
  }
});

export default router;
