// server.js - TechBridge Backend Server
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'techbridge_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
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
    description: 'Learn Python basics from scratch. Perfect for beginners!',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 45,
    startDate: '2024-09-10',
    endDate: '2024-12-20',
    published: true,
    lessons: [
      { id: 1, title: 'Variables and Data Types', content: 'Learn about Python variables, integers, strings, and basic data types.', duration: 45 },
      { id: 2, title: 'Control Flow', content: 'Master if statements, loops, and conditional logic in Python.', duration: 60 },
      { id: 3, title: 'Functions', content: 'Learn how to create reusable functions and understand scope.', duration: 50 }
    ]
  },
  {
    id: 2,
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript basics for building modern websites',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 32,
    startDate: '2024-10-01',
    endDate: '2025-01-15',
    published: true,
    lessons: [
      { id: 4, title: 'HTML Basics', content: 'Learn HTML structure, tags, and semantic markup.', duration: 40 },
      { id: 5, title: 'CSS Styling', content: 'Master CSS selectors, properties, and layouts.', duration: 55 }
    ]
  },
  {
    id: 3,
    title: 'Data Structures and Algorithms',
    description: 'Master fundamental data structures and problem-solving techniques',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 28,
    startDate: '2024-11-01',
    endDate: '2025-02-15',
    published: true,
    lessons: [
      { id: 6, title: 'Arrays and Lists', content: 'Understanding array operations and list manipulation.', duration: 50 },
      { id: 7, title: 'Sorting Algorithms', content: 'Learn bubble sort, merge sort, and quick sort.', duration: 65 }
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
        options: ['A snake', 'A programming language', 'A database', 'An operating system'],
        correctAnswer: 1
      },
      {
        id: 2,
        text: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1
      },
      {
        id: 3,
        text: 'What is the correct file extension for Python files?',
        options: ['.python', '.py', '.pt', '.pyt'],
        correctAnswer: 1
      },
      {
        id: 4,
        text: 'Which of these is a valid variable name in Python?',
        options: ['2variable', 'my-variable', 'my_variable', 'my variable'],
        correctAnswer: 2
      },
      {
        id: 5,
        text: 'What does print() function do?',
        options: ['Saves data', 'Displays output', 'Deletes data', 'Creates variables'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    title: 'HTML & CSS Fundamentals Quiz',
    duration: 25,
    totalMarks: 100,
    passingScore: 60,
    questions: [
      {
        id: 1,
        text: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctAnswer: 0
      },
      {
        id: 2,
        text: 'Which HTML tag is used for the largest heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        correctAnswer: 2
      },
      {
        id: 3,
        text: 'What does CSS stand for?',
        options: ['Colorful Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets'],
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
        content: 'Great course! Really enjoying learning Python. The examples are very clear.',
        timestamp: '2024-11-15T14:25:00Z',
        replies: []
      },
      {
        id: 2,
        author: 'Dr. Jane Teacher',
        authorId: 2,
        content: 'Welcome everyone! Feel free to ask questions about any of the lessons.',
        timestamp: '2024-11-10T09:00:00Z',
        replies: []
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    topic: 'Web Development Discussion',
    posts: []
  },
  {
    id: 3,
    courseId: 3,
    topic: 'DSA Discussion Forum',
    posts: []
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
  res.json({ 
    message: 'TechBridge API is running successfully!', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      courses: '/api/courses',
      quizzes: '/api/quizzes/*',
      forum: '/api/courses/:id/forum',
      admin: '/api/admin/*'
    }
  });
});

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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

// Get students enrolled in a specific course (Teacher/Admin)
app.get('/api/courses/:id/students', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const courseId = parseInt(req.params.id);
  const enrolledStudents = users.filter(u => 
    u.role === 'student' && 
    u.enrolledCourses && 
    u.enrolledCourses.includes(courseId)
  ).map(({ password, ...student }) => ({
    ...student,
    progress: {
      completedLessons: student.completedLessons?.length || 0,
      completedQuizzes: student.quizScores?.length || 0,
      averageScore: student.quizScores?.length 
        ? student.quizScores.reduce((acc, q) => acc + q.score, 0) / student.quizScores.length 
        : 0
    }
  }));

  res.json(enrolledStudents);
});

// Get teacher's created courses (Teacher only)
app.get('/api/teacher/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const teacherCourses = courses.filter(c => c.instructorId === req.user.id);
  res.json(teacherCourses);
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

  let correctAnswers = 0;
  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / quiz.questions.length) * quiz.totalMarks;
  const passed = score >= quiz.passingScore;

  const user = users.find(u => u.id === req.user.id);
  if (!user.quizScores) {
    user.quizScores = [];
  }
  user.quizScores.push({ quizId, score, passed, date: new Date() });
  
  if (passed) {
    user.totalPoints = (user.totalPoints || 0) + 50;
  }

  res.json({
    score,
    totalMarks: quiz.totalMarks,
    passed,
    correctAnswers,
    totalQuestions: quiz.questions.length,
    percentage: ((score / quiz.totalMarks) * 100).toFixed(1)
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
  console.log(`✅ TechBridge API running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
  console.log(`\n🔐 Demo Accounts:`);
  console.log(`   Student: student@techbridge.com / Student123!`);
  console.log(`   Teacher: teacher@techbridge.com / Teacher123!`);
  console.log(`   Admin: admin@techbridge.com / Admin123!`);
});