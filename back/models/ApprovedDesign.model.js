import mongoose from 'mongoose';

const ApprovedDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  designName: String,
  modelUrl: String,
  thumbnailUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ApprovedDesign', ApprovedDesignSchema);
