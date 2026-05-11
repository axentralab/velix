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

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1d';
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for guest orders
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedSize: { type: String },
    selectedColor: { type: String },
  }],
  payment: {
    method: { type: String, required: true, enum: ['cod', 'bkash', 'card'] },
    status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    bkashNumber: { type: String },
    cardLastFour: { type: String },
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered', 'cancelled'] },
  trackingNumber: { type: String },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: tokenExpiry });
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with that email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = createToken(newUser);
    res.json({ token, user: userResponse(newUser) });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
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

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
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

app.post('/api/auth/reset-password', async (req, res) => {
  try {
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

// ── Order Management ─────────────────────────────────────────────────────────

// Create Order (supports both guest and authenticated users)
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, shippingAddress, items, payment, pricing } = req.body;

    // Generate unique order number
    const orderNumber = `VELOURA-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Get user ID if authenticated
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = jwt.verify(token, jwtSecret);
        userId = payload.id;
      } catch (err) {
        // Invalid token, treat as guest
      }
    }

    const order = new Order({
      orderNumber,
      customer: {
        ...customer,
        userId,
      },
      shippingAddress,
      items,
      payment,
      pricing,
    });

    await order.save();

    res.status(201).json({
      orderNumber,
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber,
        status: order.status,
        total: order.pricing.total,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during order creation', error: error.message });
  }
});

// Get User Orders (requires authentication)
app.get('/api/orders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, jwtSecret);
    const userId = payload.id;

    const orders = await Order.find({ 'customer.userId': userId })
      .sort({ createdAt: -1 })
      .select('orderNumber status pricing.total createdAt trackingNumber');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
});

// Get Single Order (requires authentication)
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, jwtSecret);
    const userId = payload.id;

    const order = await Order.findOne({
      orderNumber,
      'customer.userId': userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
