import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;
const dataPath = path.join(__dirname, 'data', 'users.json');
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1d';

app.use(cors());
app.use(express.json());

async function readUsers() {
  try {
    const file = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, JSON.stringify([]));
      return [];
    }
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf-8');
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: tokenExpiry });
}

function userResponse(user) {
  const { password, ...rest } = user;
  return rest;
}

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const users = await readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(409).json({ message: 'User already exists with that email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  const token = createToken(newUser);
  res.json({ token, user: userResponse(newUser) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken(user);
  res.json({ token, user: userResponse(user) });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.json({ message: 'If the email exists, a reset link has been sent.' });
  }

  const resetToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '15m' });

  return res.json({
    message: 'Password reset token created. Use this token with /api/auth/reset-password.',
    token: resetToken,
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const users = await readUsers();
    const user = users.find((entry) => entry.id === payload.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = await bcrypt.hash(password, 10);
    await writeUsers(users);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
