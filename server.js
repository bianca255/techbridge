// TechBridge Backend Server
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// ==================== IN-MEMORY DATA ====================

// Users
let users = [
  {
    id: 1,
    name: 'John Student',
    email: 'student@techbridge.com',
    password: bcrypt.hashSync('Student123!', 10),
    role: 'student',
    points: 0
  },
  {
    id: 2,
    name: 'Dr. Jane Teacher',
    email: 'teacher@techbridge.com',
    password: bcrypt.hashSync('Teacher123!', 10),
    role: 'teacher',
    points: 0
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@techbridge.com',
    password: bcrypt.hashSync('Admin123!', 10),
    role: 'admin',
    points: 0
  }
];

// Courses
const courses = [
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
      { id: 1, title: 'Variables and Data Types', content: 'Learn about Python variables, strings, integers, floats, and booleans. Understand how to declare and use variables effectively.', duration: 45 },
      { id: 2, title: 'Control Flow', content: 'Master if statements, elif, else, and loops (for and while). Learn how to control program execution.', duration: 60 },
      { id: 3, title: 'Functions', content: 'Learn how to create reusable functions, pass parameters, and return values. Understand scope and lambda functions.', duration: 50 }
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
      { id: 1, title: 'HTML Basics', content: 'Learn HTML structure, tags, elements, and semantic HTML. Build your first web page.', duration: 40 },
      { id: 2, title: 'CSS Styling', content: 'Master CSS selectors, properties, flexbox, and grid. Learn to style beautiful websites.', duration: 55 },
      { id: 3, title: 'JavaScript Fundamentals', content: 'Learn JavaScript basics, DOM manipulation, events, and ES6 features.', duration: 65 }
    ]
  },
  {
    id: 3,
    title: 'Data Structures and Algorithms',
    description: 'Master essential DSA concepts',
    instructor: 'Dr. Jane Teacher',
    instructorId: 2,
    enrollmentCount: 28,
    startDate: '2024-11-01',
    endDate: '2025-02-28',
    published: true,
    lessons: [
      { id: 1, title: 'Arrays and Lists', content: 'Learn about arrays, linked lists, and their operations. Understand time complexity.', duration: 50 },
      { id: 2, title: 'Stacks and Queues', content: 'Master stack and queue data structures and their real-world applications.', duration: 45 }
    ]
  }
];

// Quizzes
const quizzes = [
  {
    id: 1,
    courseId: 1,
    title: 'Python Basics Quiz',
    passingScore: 60,
    questions: [
      {
        id: 1,
        text: 'What is the correct way to declare a variable in Python?',
        options: ['var x = 5', 'x = 5', 'int x = 5', 'let x = 5'],
        correctAnswer: 1
      },
      {
        id: 2,
        text: 'Which data type is mutable in Python?',
        options: ['Tuple', 'String', 'List', 'Integer'],
        correctAnswer: 2
      },
      {
        id: 3,
        text: 'What does the len() function do?',
        options: ['Returns length', 'Returns type', 'Returns value', 'Returns none'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    title: 'HTML & CSS Quiz',
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
        text: 'Which CSS property controls text size?',
        options: ['text-size', 'font-style', 'font-size', 'text-style'],
        correctAnswer: 2
      }
    ]
  }
];

// Enrollments
let enrollments = [
  { id: 1, userId: 1, courseId: 1, enrolledAt: new Date('2024-09-15') },
  { id: 2, userId: 1, courseId: 2, enrolledAt: new Date('2024-10-05') }
];

// Progress tracking
let progress = [
  { id: 1, userId: 1, courseId: 1, lessonId: 1, type: 'lesson', completedAt: new Date() },
  { id: 2, userId: 1, courseId: 1, lessonId: 2, type: 'lesson', completedAt: new Date() },
  { id: 3, userId: 1, courseId: 2, quizId: 2, type: 'quiz', score: 100, completedAt: new Date() }
];

// Certificates
let certificates = [];

// Contact info
const contactInfo = {
  email: 'info@techbridge.com',
  phone: '+250 788 123 456',
  address: 'KG 7 Ave, Kigali, Rwanda',
  officeHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
  socialMedia: {
    twitter: '@TechBridgeRW',
    linkedin: 'linkedin.com/company/techbridge',
    facebook: 'facebook.com/techbridge',
    instagram: '@techbridge_rw'
  }
};

// About info
const aboutInfo = {
  mission: 'To bridge the digital skills gap by providing accessible, high-quality technology education to learners across Africa and beyond.',
  vision: 'A world where everyone has equal access to quality digital education and the opportunity to build successful careers in technology.',
  founded: '2024',
  location: 'Kigali, Rwanda',
  values: [
    { title: 'Accessibility', description: 'Making quality education available to everyone, everywhere' },
    { title: 'Excellence', description: 'Delivering world-class content and learning experiences' },
    { title: 'Innovation', description: 'Continuously improving our platform and teaching methods' },
    { title: 'Community', description: 'Building a supportive network of learners and educators' }
  ],
  offerings: [
    { title: 'Expert-Led Courses', description: 'Learn from industry professionals with real-world experience' },
    { title: 'Interactive Learning', description: 'Hands-on projects and assessments to reinforce knowledge' },
    { title: 'Flexible Schedule', description: 'Learn at your own pace, anytime, anywhere' },
    { title: 'Career Support', description: 'Get guidance and resources to advance your career' }
  ]
};

// ==================== MIDDLEWARE ====================

// Authentication middleware
function authenticateToken(req, res, next) {
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
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      points: 0
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// ==================== COURSE ROUTES ====================

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Get single course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// Enroll in course
app.post('/api/courses/:id/enroll', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.userId;

  // Check if already enrolled
  if (enrollments.find(e => e.userId === userId && e.courseId === courseId)) {
    return res.status(400).json({ error: 'Already enrolled' });
  }

  // Create enrollment
  const enrollment = {
    id: enrollments.length + 1,
    userId,
    courseId,
    enrolledAt: new Date()
  };

  enrollments.push(enrollment);
  res.json({ message: 'Enrolled successfully' });
});

// Get user's enrolled courses
app.get('/api/users/enrolled-courses', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  const enrolledCourses = userEnrollments.map(enrollment => {
    return courses.find(c => c.id === enrollment.courseId);
  }).filter(c => c);

  res.json(enrolledCourses);
});

// Get course quizzes
app.get('/api/courses/:id/quizzes', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseQuizzes = quizzes.filter(q => q.courseId === courseId);
  res.json(courseQuizzes);
});

// ==================== QUIZ ROUTES ====================

// Submit quiz
app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
  const quizId = parseInt(req.params.id);
  const { answers } = req.body;
  const userId = req.user.userId;

  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  // Calculate score
  let correct = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correct++;
    }
  });

  const score = Math.round((correct / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  // Save progress
  const progressEntry = {
    id: progress.length + 1,
    userId,
    courseId: quiz.courseId,
    quizId,
    type: 'quiz',
    score,
    completedAt: new Date()
  };
  progress.push(progressEntry);

  // Award points if passed
  if (passed) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.points += 50;
    }
  }

  res.json({
    score,
    totalMarks: 100,
    passed,
    message: passed ? 'Congratulations! You passed!' : 'Keep practicing!'
  });
});

// ==================== LESSON ROUTES ====================

// Complete lesson
app.post('/api/lessons/:id/complete', authenticateToken, (req, res) => {
  const lessonId = parseInt(req.params.id);
  const userId = req.user.userId;

  // Find which course this lesson belongs to
  let courseId = null;
  for (const course of courses) {
    if (course.lessons && course.lessons.find(l => l.id === lessonId)) {
      courseId = course.id;
      break;
    }
  }

  if (!courseId) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  // Check if already completed
  const alreadyCompleted = progress.find(
    p => p.userId === userId && p.lessonId === lessonId && p.type === 'lesson'
  );

  if (alreadyCompleted) {
    return res.status(400).json({ error: 'Lesson already completed' });
  }

  // Save progress
  const progressEntry = {
    id: progress.length + 1,
    userId,
    courseId,
    lessonId,
    type: 'lesson',
    completedAt: new Date()
  };
  progress.push(progressEntry);

  // Award points
  const user = users.find(u => u.id === userId);
  if (user) {
    user.points += 10;
  }

  res.json({
    message: 'Lesson completed!',
    pointsEarned: 10,
    totalPoints: user ? user.points : 0
  });
});

// ==================== PROGRESS ROUTES ====================

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const user = users.find(u => u.id === userId);

  const userProgress = progress.filter(p => p.userId === userId);
  const completedLessons = userProgress.filter(p => p.type === 'lesson').length;
  const completedQuizzes = userProgress.filter(p => p.type === 'quiz').length;
  const enrolledCourses = enrollments.filter(e => e.userId === userId).length;

  res.json({
    enrolledCourses,
    completedLessons,
    completedQuizzes,
    totalPoints: user ? user.points : 0
  });
});

// ==================== REPORTS ROUTES ====================

// Student reports
app.get('/api/users/reports', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's enrolled courses
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  const enrolledCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const instructor = users.find(u => u.id === course?.instructorId);

    // Get progress for this course
    const courseProgress = progress.filter(p => p.userId === userId && p.courseId === enrollment.courseId);
    const lessonsCompleted = courseProgress.filter(p => p.type === 'lesson').length;
    const quizResults = courseProgress.filter(p => p.type === 'quiz');
    const avgScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, q) => sum + (q.score || 0), 0) / quizResults.length)
      : 0;

    return {
      courseTitle: course?.title || 'Unknown',
      instructor: instructor?.name || 'Unknown',
      progress: {
        lessonsCompleted,
        quizzesTaken: quizResults.length,
        averageQuizScore: avgScore,
        completionRate: course?.lessons ? Math.round((lessonsCompleted / course.lessons.length) * 100) : 0
      }
    };
  });

  const allProgress = progress.filter(p => p.userId === userId);
  const totalLessons = allProgress.filter(p => p.type === 'lesson').length;
  const allQuizzes = allProgress.filter(p => p.type === 'quiz');
  const avgScore = allQuizzes.length > 0
    ? Math.round(allQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / allQuizzes.length)
    : 0;

  res.json({
    studentInfo: {
      name: user.name,
      email: user.email,
      totalPoints: user.points || 0
    },
    coursesEnrolled: userEnrollments.length,
    overallStats: {
      totalLessonsCompleted: totalLessons,
      totalQuizzesTaken: allQuizzes.length,
      averageScore: avgScore
    },
    coursesDetails: enrolledCourses,
    generatedAt: new Date().toISOString()
  });
});

// Platform reports (admin)
app.get('/api/reports/platform', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalEnrollments = enrollments.length;
  const totalLessonsCompleted = progress.filter(p => p.type === 'lesson').length;
  const totalQuizzesTaken = progress.filter(p => p.type === 'quiz').length;

  const allQuizzes = progress.filter(p => p.type === 'quiz');
  const avgPlatformScore = allQuizzes.length > 0
    ? allQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / allQuizzes.length
    : 0;

  // Top courses by enrollment
  const courseEnrollments = {};
  enrollments.forEach(e => {
    courseEnrollments[e.courseId] = (courseEnrollments[e.courseId] || 0) + 1;
  });

  const topCourses = Object.entries(courseEnrollments)
    .map(([courseId, count]) => {
      const course = courses.find(c => c.id === parseInt(courseId));
      const instructor = users.find(u => u.id === course?.instructorId);
      return {
        title: course?.title || 'Unknown',
        enrollments: count,
        instructor: instructor?.name || 'Unknown'
      };
    })
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5);

  res.json({
    overview: {
      totalUsers: users.length,
      totalStudents,
      totalTeachers,
      totalCourses: courses.length
    },
    engagement: {
      totalEnrollments,
      totalLessonsCompleted,
      totalQuizzesTaken,
      averagePlatformScore: avgPlatformScore
    },
    topCourses,
    generatedAt: new Date().toISOString()
  });
});

// ==================== ADMIN ROUTES ====================

// Get all users (admin)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  }));

  res.json(safeUsers);
});

// Get admin stats
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const activeStudents = users.filter(u => u.role === 'student').length;
  const totalEnrollments = enrollments.length;

  res.json({
    totalUsers,
    totalCourses,
    activeStudents,
    totalEnrollments
  });
});

// ==================== CERTIFICATE ROUTES ====================

// Get user certificates
app.get('/api/users/certificates', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get user's enrolled courses
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  const enrolledCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return course;
  }).filter(c => c);

  res.json(enrolledCourses);
});

// Generate certificate
app.get('/api/courses/:id/certificate', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.userId;
  const user = users.find(u => u.id === userId);
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Check if enrolled
  const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (!enrollment) {
    return res.status(400).json({ error: 'Not enrolled in this course' });
  }

  // Check course completion
  const courseProgress = progress.filter(p => p.userId === userId && p.courseId === courseId);
  const lessonsCompleted = courseProgress.filter(p => p.type === 'lesson').length;
  const totalLessons = course.lessons?.length || 0;

  if (lessonsCompleted < totalLessons) {
    return res.status(400).json({ error: 'Complete all lessons to earn certificate' });
  }

  // Check quizzes
  const courseQuizzes = quizzes.filter(q => q.courseId === courseId);
  const completedQuizzes = courseProgress.filter(p => p.type === 'quiz');

  if (completedQuizzes.length < courseQuizzes.length) {
    return res.status(400).json({ error: 'Pass all quizzes to earn certificate' });
  }

  // Check if all quizzes passed
  const failedQuizzes = completedQuizzes.filter(q => q.score < 60);
  if (failedQuizzes.length > 0) {
    return res.status(400).json({ error: 'You must pass all quizzes with 60% or higher' });
  }

  // Generate certificate
  const instructor = users.find(u => u.id === course.instructorId);
  const certificateNumber = `TB-${Date.now()}-${userId}-${courseId}`;

  const certificate = {
    certificateNumber,
    studentName: user.name,
    courseName: course.title,
    instructor: instructor?.name || 'TechBridge Instructor',
    completionDate: new Date().toISOString()
  };

  certificates.push(certificate);

  res.json(certificate);
});

// ==================== STATIC INFO ROUTES ====================

// Get contact info
app.get('/api/contact', (req, res) => {
  res.json(contactInfo);
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact form submission:', { name, email, subject, message });
  res.json({ message: 'Message received! We will respond within 24 hours.' });
});

// Get about info
app.get('/api/about', (req, res) => {
  res.json(aboutInfo);
});

// ==================== ROOT ROUTE ====================

app.get('/', (req, res) => {
  res.json({
    message: 'TechBridge API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      courses: '/api/courses/*',
      progress: '/api/progress',
      reports: '/api/users/reports',
      certificates: '/api/users/certificates'
    }
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`TechBridge API server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});