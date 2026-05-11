import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend folder (local dev) or from Vercel env vars
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const app = express();
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1d';
const mongoUri = process.env.MONGO_URI;

// CORS — allow all origins in production (Vercel handles this)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB Connection (cached for serverless)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log('MongoDB connected');
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: tokenExpiry });
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running on Vercel' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with that email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser);
    res.json({ token, user: userResponse(newUser) });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);
    res.json({ token, user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '15m' });
    return res.json({
      message: 'Password reset token created. Use this token with /api/auth/reset-password.',
      token: resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during forgot password', error: error.message });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    await connectDB();
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

export default app;
