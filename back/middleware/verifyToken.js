import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    // keep this in mind, we are finding the username and storing it into user

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.mula = user; // store user in req object
  
    // so, hamle, req.mula ma hami sanga vaako req.uer ko data haldim so uta index.js ma use garna sakiyos
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
