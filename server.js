// server.js - TechBridge Backend Server
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'techbridge_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let users = [
  {
    id: 1,
    name: 'John Student',
    email: 'student@techbridge.com',
    password: bcrypt.hashSync('Student123!', 10),
    role: 'student',
    enrolledCourses: [1],
    completedLessons: [1, 2],
    quizScores: [{ quizId: 1, score: 85, passed: true }],
    totalPoints: 450
  },
  {
    id: 2,
    name: 'Dr. Jane Teacher',
    email: 'teacher@techbridge.com',
    password: bcrypt.hashSync('Teacher123!', 10),
    role: 'teacher',
    expertise: 'Programming',
    createdCourses: [1, 2]
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@techbridge.com',
    password: bcrypt.hashSync('Admin123!', 10),
    role: 'admin'
  }
];

let courses = [
  {
    id: 1,
    title: 'Introduction to Python Programming',
    description: 'Learn Python basics from scratch',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 45,
    startDate: '2024-09-10',
    endDate: '2024-12-20',
    published: true,
    lessons: [
      { id: 1, title: 'Variables and Data Types', content: 'Learn about Python variables', duration: 45 },
      { id: 2, title: 'Control Flow', content: 'Learn about if statements and loops', duration: 60 },
      { id: 3, title: 'Functions', content: 'Learn how to create functions', duration: 50 }
    ]
  },
  {
    id: 2,
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript basics',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 32,
    startDate: '2024-10-01',
    endDate: '2025-01-15',
    published: true,
    lessons: [
      { id: 1, title: 'HTML Basics', content: 'Learn HTML structure', duration: 40 },
      { id: 2, title: 'CSS Styling', content: 'Learn to style websites', duration: 55 }
    ]
  }
];

let quizzes = [
  {
    id: 1,
    courseId: 1,
    title: 'Python Basics Quiz',
    duration: 30,
    totalMarks: 50,
    passingScore: 30,
    questions: [
      {
        id: 1,
        text: 'What is Python?',
        options: ['A snake', 'A programming language', 'A database', 'An operating system'],
        correctAnswer: 1
      },
      {
        id: 2,
        text: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1
      }
    ]
  }
];

let forums = [
  {
    id: 1,
    courseId: 1,
    topic: 'Python Discussion Board',
    posts: [
      {
        id: 1,
        author: 'John Student',
        authorId: 1,
        content: 'Great course! Really enjoying Python.',
        timestamp: '2024-11-15T14:25:00Z',
        replies: []
      }
    ]
  }
];

let assignments = [
  {
    id: 1,
    courseId: 1,
    title: 'Python Calculator Project',
    description: 'Build a basic calculator',
    dueDate: '2024-11-30',
    maxScore: 100,
    submissions: []
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'TechBridge API is running', version: '1.0.0' });
});

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role,
      enrolledCourses: [],
      completedLessons: [],
      quizScores: [],
      totalPoints: 0
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// COURSE ROUTES

// Get all courses
app.get('/api/courses', (req, res) => {
  const publishedCourses = courses.filter(c => c.published);
  res.json(publishedCourses);
});

// Get single course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// Create course (Teacher/Admin only)
app.post('/api/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { title, description, startDate, endDate } = req.body;
  const user = users.find(u => u.id === req.user.id);

  const newCourse = {
    id: courses.length + 1,
    title,
    description,
    instructor: user.name,
    instructorId: user.id,
    enrollmentCount: 0,
    startDate,
    endDate,
    published: true,
    lessons: []
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// Enroll in course
app.post('/api/courses/:id/enroll', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const user = users.find(u => u.id === req.user.id);

  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  if (user.enrolledCourses.includes(courseId)) {
    return res.status(400).json({ error: 'Already enrolled in this course' });
  }

  user.enrolledCourses.push(courseId);
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.enrollmentCount++;
  }

  res.json({ message: 'Enrolled successfully', course });
});

// Get enrolled courses
app.get('/api/users/enrolled-courses', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const enrolledCourses = courses.filter(c => 
    user.enrolledCourses && user.enrolledCourses.includes(c.id)
  );
  res.json(enrolledCourses);
});

// QUIZ ROUTES

// Get quizzes for a course
app.get('/api/courses/:id/quizzes', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseQuizzes = quizzes.filter(q => q.courseId === courseId);
  res.json(courseQuizzes);
});

// Submit quiz
app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
  const quizId = parseInt(req.params.id);
  const { answers } = req.body;
  const quiz = quizzes.find(q => q.id === quizId);

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  // Calculate score
  let correctAnswers = 0;
  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / quiz.questions.length) * quiz.totalMarks;
  const passed = score >= quiz.passingScore;

  // Save score
  const user = users.find(u => u.id === req.user.id);
  if (!user.quizScores) {
    user.quizScores = [];
  }
  user.quizScores.push({ quizId, score, passed, date: new Date() });

  res.json({
    score,
    totalMarks: quiz.totalMarks,
    passed,
    correctAnswers,
    totalQuestions: quiz.questions.length
  });
});

// FORUM ROUTES

// Get forum posts for a course
app.get('/api/courses/:id/forum', (req, res) => {
  const courseId = parseInt(req.params.id);
  const forum = forums.find(f => f.courseId === courseId);
  res.json(forum || { id: 0, courseId, topic: 'Discussion Board', posts: [] });
});

// Create forum post
app.post('/api/courses/:id/forum', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const { content } = req.body;
  const user = users.find(u => u.id === req.user.id);

  let forum = forums.find(f => f.courseId === courseId);
  if (!forum) {
    forum = {
      id: forums.length + 1,
      courseId,
      topic: 'Discussion Board',
      posts: []
    };
    forums.push(forum);
  }

  const newPost = {
    id: forum.posts.length + 1,
    author: user.name,
    authorId: user.id,
    content,
    timestamp: new Date().toISOString(),
    replies: []
  };

  forum.posts.push(newPost);
  res.status(201).json(newPost);
});

// PROGRESS ROUTES

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  const progress = {
    completedLessons: user.completedLessons ? user.completedLessons.length : 0,
    completedQuizzes: user.quizScores ? user.quizScores.length : 0,
    averageScore: user.quizScores && user.quizScores.length > 0
      ? user.quizScores.reduce((acc, q) => acc + q.score, 0) / user.quizScores.length
      : 0,
    totalPoints: user.totalPoints || 0,
    enrolledCourses: user.enrolledCourses ? user.enrolledCourses.length : 0
  };

  res.json(progress);
});

// Mark lesson as complete
app.post('/api/lessons/:id/complete', authenticateToken, (req, res) => {
  const lessonId = parseInt(req.params.id);
  const user = users.find(u => u.id === req.user.id);

  if (!user.completedLessons) {
    user.completedLessons = [];
  }

  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    user.totalPoints = (user.totalPoints || 0) + 10;
  }

  res.json({ message: 'Lesson marked as complete', totalPoints: user.totalPoints });
});

// ADMIN ROUTES

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// Get platform statistics (Admin only)
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    totalEnrollments: users.reduce((acc, u) => acc + (u.enrolledCourses?.length || 0), 0),
    totalQuizzes: quizzes.length,
    activeStudents: users.filter(u => u.role === 'student').length,
    totalTeachers: users.filter(u => u.role === 'teacher').length
  };

  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`TechBridge API server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});