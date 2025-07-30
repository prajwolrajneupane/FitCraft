import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });//khoj, ani exist garxa vane talako message pathaide
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);//password hashed by bcrypt
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  // does exact job as the .create()..It saves newUser to data to mongoDB

  res.status(201).json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // above line is creating token, what it is doing vanda,payload(user._id) lai lera, secret key sanga milayera, jwt.sign is creating a token
  
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
// this token is sent to the front end and is being stored in the localstorage.
});

export default router;
