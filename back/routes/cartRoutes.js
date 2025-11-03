//cart ko routing ko lagi
import express from "express";
import Cart from "../models/cart.js";

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, designId, name, model, imageUrl, price } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.designId.toString() === designId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ designId, name, model, imageUrl, price });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// Remove item
router.delete("/:userId/:designId", async (req, res) => {
  try {
    const { userId, designId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.designId.toString() !== designId
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

export default router;
