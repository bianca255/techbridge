const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/techbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const { User, Course, Quiz, Progress, Forum } = require('./models');

// JWT auth middleware
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date() });
});

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: 'Registered', user });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// ===== COURSE ROUTES =====

// Get all courses
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Add course (teacher/admin)
app.post('/api/courses', auth, async (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ error: 'Forbidden' });
  const course = await Course.create(req.body);
  res.json(course);
});

// ===== QUIZ ROUTES =====

// Get quiz by course
app.get('/api/quiz/:courseId', async (req, res) => {
  const quiz = await Quiz.findOne({ courseId: req.params.courseId });
  res.json(quiz);
});

// Submit quiz
app.post('/api/quiz/:courseId', auth, async (req, res) => {
  const { score } = req.body;
  await Progress.updateOne(
    { userId: req.user.id, courseId: req.params.courseId },
    { $push: { quizScores: score } },
    { upsert: true }
  );
  res.json({ message: 'Score saved' });
});

// ===== PROGRESS ROUTES =====
app.get('/api/progress/:courseId', auth, async (req, res) => {
  const progress = await Progress.findOne({ userId: req.user.id, courseId: req.params.courseId });
  res.json(progress);
});

// ===== FORUM ROUTES =====
app.get('/api/forum/:courseId', async (req, res) => {
  const forum = await Forum.findOne({ courseId: req.params.courseId });
  res.json(forum ? forum.posts : []);
});

app.post('/api/forum/:courseId', auth, async (req, res) => {
  const { message } = req.body;
  await Forum.updateOne(
    { courseId: req.params.courseId },
    { $push: { posts: { userId: req.user.id, message } } },
    { upsert: true }
  );
  res.json({ message: 'Posted' });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`TechBridge backend listening on port ${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
});
