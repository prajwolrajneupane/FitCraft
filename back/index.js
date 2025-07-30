import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.js';
import User from './models/User.js';
import verifyToken from './middleware/verifyToken.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);

//  Route to get user profile (uses token)
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    res.json({
      // yo mula verifytoken bata aaira ho

      name: req.mula.name,
      email: req.mula.email,
      model: req.mula.model || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Multer for .glb uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


app.post('/api/save', verifyToken, upload.single('model'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // req.mula.model = req.file.filename;
    //this will override everything.. so we will use push instead:
    req.mula.model.push(req.file.filename);

    await req.mula.save();

    res.status(200).json({
      message: 'Model uploaded and saved to user',
      model: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  }))
  .catch(err => console.log(err));
