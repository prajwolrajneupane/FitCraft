import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      designId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApprovedDesign",
        required: true,
      },
      name: String,
      model: String,
      imageUrl: String,
      price: { type: Number, default: 999 },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
