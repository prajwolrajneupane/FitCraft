import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Hardcoded admin credentials
const ADMIN_EMAIL = "admin@fitcraft.com";
const ADMIN_PASS = "admin123";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "2h",
      }
    );
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
