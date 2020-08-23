import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../utils/auth';
import User from '../models/user.model';

const authRouter = express.Router();


authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) throw new Error('An account already exists for this email address.');

    // Asynchronously generate a salt
    const salt = await bcrypt.genSalt(10);
    // Asynchronously encrypt the password string
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email,
      hashedPassword
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});   // end of authRouter.post('/register')


authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found.');

    // If a matching user is found, check if password is correct
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new Error('Invalid credential.')
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
      if (!token) throw new Error('Failed to sign the token.');
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});   // end of authRouter.post('/login')


authRouter.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new Error('No user found.');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export default authRouter;