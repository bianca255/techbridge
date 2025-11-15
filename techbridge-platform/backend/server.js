const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'techbridge_secret_key_2024';

app.use(cors());
app.use(express.json());

let users = [
  {
    id: 1,
    name: 'John Student',
    email: 'student@techbridge.com',
    password: bcrypt.hashSync('Student123!', 10),
    role: 'student',
    enrolledCourses: [1],
    completedLessons: [1],
    quizScores: [],
    totalPoints: 10
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
    published: true,
    lessons: [
      { id: 1, title: 'Variables and Data Types', content: 'Learn about Python variables', duration: 45 },
      { id: 2, title: 'Control Flow', content: 'Master if statements and loops', duration: 60 },
      { id: 3, title: 'Functions', content: 'Learn to create functions', duration: 50 }
    ]
  },
  {
    id: 2,
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript basics',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 32,
    published: true,
    lessons: [
      { id: 4, title: 'HTML Basics', content: 'Learn HTML structure', duration: 40 },
      { id: 5, title: 'CSS Styling', content: 'Master CSS', duration: 55 }
    ]
  }
];

let quizzes = [
  {
    id: 1,
    courseId: 1,
    title: 'Python Basics Quiz',
    duration: 30,
    totalMarks: 100,
    passingScore: 60,
    questions: [
      {
        id: 1,
        text: 'What is Python?',
        options: ['A snake', 'A programming language', 'A database', 'An OS'],
        correctAnswer: 1
      },
      {
        id: 2,
        text: 'Which keyword defines a function in Python?',
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
    topic: 'Python Discussion',
    posts: []
  }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.json({ message: 'TechBridge API is running!', version: '1.0.0' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email exists' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    enrolledCourses: [],
    completedLessons: [],
    quizScores: [],
    totalPoints: 0
  };
  users.push(newUser);
  const token = jwt.sign({ id: newUser.id, email, role }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ message: 'Registered', token, user: { id: newUser.id, name, email, role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: 'Login success', token, user: { id: user.id, name: user.name, email, role: user.role } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.get('/api/courses', (req, res) => {
  res.json(courses.filter(c => c.published));
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.post('/api/courses/:id/enroll', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const user = users.find(u => u.id === req.user.id);
  if (!user.enrolledCourses) user.enrolledCourses = [];
  if (user.enrolledCourses.includes(courseId)) {
    return res.status(400).json({ error: 'Already enrolled' });
  }
  user.enrolledCourses.push(courseId);
  const course = courses.find(c => c.id === courseId);
  if (course) course.enrollmentCount++;
  res.json({ message: 'Enrolled', course });
});

app.get('/api/users/enrolled-courses', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const enrolled = courses.filter(c => user.enrolledCourses && user.enrolledCourses.includes(c.id));
  res.json(enrolled);
});

app.get('/api/courses/:id/quizzes', (req, res) => {
  const courseId = parseInt(req.params.id);
  res.json(quizzes.filter(q => q.courseId === courseId));
});

app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
  const quiz = quizzes.find(q => q.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const { answers } = req.body;
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) correct++;
  });
  const score = (correct / quiz.questions.length) * quiz.totalMarks;
  const passed = score >= quiz.passingScore;
  const user = users.find(u => u.id === req.user.id);
  if (!user.quizScores) user.quizScores = [];
  user.quizScores.push({ quizId: quiz.id, score, passed });
  if (passed) user.totalPoints += 50;
  res.json({ score, totalMarks: quiz.totalMarks, passed, correctAnswers: correct, totalQuestions: quiz.questions.length });
});

app.get('/api/courses/:id/forum', (req, res) => {
  const forum = forums.find(f => f.courseId === parseInt(req.params.id));
  res.json(forum || { id: 0, courseId: parseInt(req.params.id), topic: 'Discussion', posts: [] });
});

app.post('/api/courses/:id/forum', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const user = users.find(u => u.id === req.user.id);
  let forum = forums.find(f => f.courseId === courseId);
  if (!forum) {
    forum = { id: forums.length + 1, courseId, topic: 'Discussion', posts: [] };
    forums.push(forum);
  }
  const post = {
    id: forum.posts.length + 1,
    author: user.name,
    content: req.body.content,
    timestamp: new Date().toISOString()
  };
  forum.posts.push(post);
  res.status(201).json(post);
});

app.get('/api/progress', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({
    completedLessons: user.completedLessons?.length || 0,
    completedQuizzes: user.quizScores?.length || 0,
    averageScore: user.quizScores?.length ? user.quizScores.reduce((a, q) => a + q.score, 0) / user.quizScores.length : 0,
    totalPoints: user.totalPoints || 0,
    enrolledCourses: user.enrolledCourses?.length || 0
  });
});

app.post('/api/lessons/:id/complete', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user.completedLessons) user.completedLessons = [];
  const lessonId = parseInt(req.params.id);
  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    user.totalPoints += 10;
  }
  res.json({ message: 'Complete', totalPoints: user.totalPoints });
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  res.json(users.map(({ password, ...u }) => u));
});

app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  res.json({
    totalUsers: users.length,
    totalCourses: courses.length,
    totalEnrollments: users.reduce((a, u) => a + (u.enrolledCourses?.length || 0), 0),
    activeStudents: users.filter(u => u.role === 'student').length,
    totalTeachers: users.filter(u => u.role === 'teacher').length
  });
});

app.listen(PORT, () => {
  console.log(`✅ TechBridge API running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});