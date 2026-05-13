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
const adminEmail = process.env.ADMIN_EMAIL || 'admin@veloura.com';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1d';
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, jwtSecret);
    if (payload.email !== adminEmail) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

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
  orderStatus: { type: String, default: 'pending_payment', enum: ['pending_payment', 'payment_verified', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'] },
  adminNotes: { type: String },
  courier: { type: String }, // e.g., Pathao, Steadfast, RedX
  estimatedDelivery: { type: Date },
  confirmedAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  courier: { type: String, required: true },
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending', enum: ['pending', 'picked', 'in_transit', 'out_for_delivery', 'delivered', 'failed'] },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  events: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    location: String,
    description: String,
  }],
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Refund Schema
const refundSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'processed'] },
  amount: { type: Number, required: true },
  refundMethod: { type: String },
  approvedAt: { type: Date },
  processedAt: { type: Date },
  adminNotes: { type: String },
}, { timestamps: true });

const Refund = mongoose.model('Refund', refundSchema);

// Payment Transaction Schema
const paymentTransactionSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  method: { type: String, required: true, enum: ['cod', 'bkash', 'nagad', 'rocket', 'card'] },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'verified', 'failed'] },
  transactionId: { type: String },
  senderNumber: { type: String }, // for bkash/nagad/rocket
  verifiedBy: { type: String }, // admin email
  verifiedAt: { type: Date },
}, { timestamps: true });

const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);

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

// Update user profile
app.patch('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    res.json({ user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
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
      status: 'pending_payment',
      orderStatus: 'pending_payment',
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
      .select('orderNumber orderStatus pricing.total createdAt trackingNumber payment.method');

    res.json(orders.map((order) => ({
      ...order.toObject(),
      status: order.orderStatus,
    })));
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

    const result = order.toObject();
    result.status = order.orderStatus;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order', error: error.message });
  }
});

// Admin: Get all orders
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select('orderNumber customer orderStatus pricing.createdAt pricing.total trackingNumber payment.method');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin orders', error: error.message });
  }
});

// Admin: Get single order details
app.get('/api/admin/orders/:orderNumber', requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin order', error: error.message });
  }
});

// Admin: Update order status
app.patch('/api/admin/orders/:orderNumber/status', requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { status, orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order status', error: error.message });
  }
});

// Admin: Confirm order (moves to processing)
app.patch('/api/admin/orders/:orderNumber/confirm', requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { orderStatus: 'processing', confirmedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error confirming order', error: error.message });
  }
});

// Admin: Create shipment/tracking
app.post('/api/admin/shipments', requireAdmin, async (req, res) => {
  try {
    const { orderNumber, courier, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shipment = new Shipment({
      orderNumber,
      courier,
      trackingNumber,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
    });

    await shipment.save();

    await Order.findOneAndUpdate(
      { orderNumber },
      { status: 'shipped', orderStatus: 'shipped', courier, trackingNumber, estimatedDelivery: shipment.estimatedDelivery }
    );

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating shipment', error: error.message });
  }
});

// Admin: Get all shipments
app.get('/api/admin/shipments', requireAdmin, async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching shipments', error: error.message });
  }
});

// Admin: Update shipment status
app.patch('/api/admin/shipments/:shipmentId', requireAdmin, async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status, courier, trackingNumber, estimatedDelivery } = req.body;

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (status && ['pending', 'picked', 'in_transit', 'out_for_delivery', 'delivered', 'failed'].includes(status)) {
      shipment.status = status;
    }
    if (courier) shipment.courier = courier;
    if (trackingNumber) shipment.trackingNumber = trackingNumber;
    if (estimatedDelivery) shipment.estimatedDelivery = new Date(estimatedDelivery);

    await shipment.save();

    if (shipment.orderNumber && status === 'delivered') {
      await Order.findOneAndUpdate(
        { orderNumber: shipment.orderNumber },
        { status: 'delivered', orderStatus: 'delivered' }
      );
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating shipment', error: error.message });
  }
});

// Get shipment tracking
app.get('/api/shipments/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const shipment = await Shipment.findOne({ orderNumber });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching shipment', error: error.message });
  }
});

// Admin: Verify payment (for manual bkash/nagad)
app.post('/api/admin/payments/:orderNumber/verify', requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { transactionId, method } = req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const transaction = new PaymentTransaction({
      orderNumber,
      method,
      amount: order.pricing.total,
      status: 'verified',
      transactionId,
      verifiedBy: req.user.email,
      verifiedAt: new Date(),
    });

    await transaction.save();

    await Order.findOneAndUpdate(
      { orderNumber },
      { 'payment.status': 'paid', status: 'processing', orderStatus: 'processing' }
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying payment', error: error.message });
  }
});

// Admin: Reject payment
app.post('/api/admin/payments/:orderNumber/reject', requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const transaction = new PaymentTransaction({
      orderNumber,
      method: order.payment.method,
      amount: order.pricing.total,
      status: 'failed',
      verifiedBy: req.user.email,
      verifiedAt: new Date(),
    });

    await transaction.save();

    await Order.findOneAndUpdate(
      { orderNumber },
      { 'payment.status': 'failed', orderStatus: 'cancelled', adminNotes: reason }
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error rejecting payment', error: error.message });
  }
});

// Admin: Get all refund requests
app.get('/api/admin/refunds', requireAdmin, async (req, res) => {
  try {
    const refunds = await Refund.find()
      .sort({ createdAt: -1 });
    res.json(refunds);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching refunds', error: error.message });
  }
});

// Admin: Approve refund
app.patch('/api/admin/refunds/:refundId/approve', requireAdmin, async (req, res) => {
  try {
    const { refundId } = req.params;
    const { adminNotes } = req.body;

    const refund = await Refund.findByIdAndUpdate(
      refundId,
      { status: 'approved', approvedAt: new Date(), adminNotes },
      { new: true }
    );

    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }

    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: 'Server error approving refund', error: error.message });
  }
});

// Admin: Analytics - Daily sales
app.get('/api/admin/analytics/sales', requireAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching analytics', error: error.message });
  }
});

// Admin: Analytics - Summary
app.get('/api/admin/analytics/summary', requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending_payment' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      processingOrders,
      shippedOrders: await Order.countDocuments({ orderStatus: 'shipped' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching summary', error: error.message });
  }
});

// Customer: Request refund
app.post('/api/refunds', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = jwt.verify(token, jwtSecret);
        userId = payload.id;
      } catch (err) {
        // Guest checkout
      }
    }

    const { orderNumber, reason } = req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'refunded') {
      return res.status(400).json({ message: 'Order already refunded' });
    }

    const refund = new Refund({
      orderNumber,
      customerId: userId,
      reason,
      amount: order.pricing.total,
    });

    await refund.save();

    res.status(201).json(refund);
  } catch (error) {
    res.status(500).json({ message: 'Server error requesting refund', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
