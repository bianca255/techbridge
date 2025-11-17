import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data);
        setCurrentPage('dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      <main className="main-content">
        {!user && currentPage === 'login' && <LoginPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />}
        {!user && currentPage === 'register' && <RegisterPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />}
        {user && currentPage === 'dashboard' && <Dashboard user={user} token={token} setCurrentPage={setCurrentPage} />}
        {user && currentPage === 'courses' && <CoursesPage user={user} token={token} />}
        {user && currentPage === 'my-courses' && <MyCoursesPage user={user} token={token} />}
        {user && currentPage === 'progress' && <ProgressPage token={token} />}
        {user && currentPage === 'admin' && <AdminPage token={token} />}
        {user && currentPage === 'reports' && <ReportsPage user={user} token={token} />}
        {user && currentPage === 'certificates' && <CertificatesPage user={user} token={token} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => onNavigate(user ? 'dashboard' : 'login')}>🎓 TechBridge</h1>
        <nav className="nav">
          {user ? (
            <>
              <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
              <button onClick={() => onNavigate('courses')}>Browse Courses</button>
              <button onClick={() => onNavigate('my-courses')}>My Courses</button>
              <button onClick={() => onNavigate('progress')}>Progress</button>
              <button onClick={() => onNavigate('reports')}>Reports</button>
              <button onClick={() => onNavigate('certificates')}>Certificates</button>
              {user.role === 'admin' && <button onClick={() => onNavigate('admin')}>Admin</button>}
              <span className="user-info">{user.name} ({user.role})</span>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}>Login</button>
              <button onClick={() => onNavigate('register')}>Register</button>
              <button onClick={() => onNavigate('about')}>About</button>
              <button onClick={() => onNavigate('contact')}>Contact</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ---------------- Login Page ---------------- */

function LoginPage({ setToken, setUser, setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setCurrentPage('dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Backend not running!');
    }
  };

  const quickLogin = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome to TechBridge</h2>
        <p className="subtitle">Login to continue learning</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="demo-accounts">
          <p><strong>🎯 Quick Login:</strong></p>
          <button className="demo-btn" onClick={() => quickLogin('student@techbridge.com', 'Student123!')}>👨‍🎓 Student</button>
          <button className="demo-btn" onClick={() => quickLogin('teacher@techbridge.com', 'Teacher123!')}>👨‍🏫 Teacher</button>
          <button className="demo-btn" onClick={() => quickLogin('admin@techbridge.com', 'Admin123!')}>👨‍💼 Admin</button>
        </div>
        <p className="auth-switch">Don't have an account? <button onClick={() => setCurrentPage('register')}>Register</button></p>
      </div>
    </div>
  );
}

/* ---------------- Register Page ---------------- */

function RegisterPage({ setToken, setUser, setCurrentPage }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: formData.role })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setCurrentPage('dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join TechBridge</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <p className="auth-switch">Already have account? <button onClick={() => setCurrentPage('login')}>Login</button></p>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ user, token, setCurrentPage }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = user.role === 'admin' ? `${API_URL}/admin/stats` : `${API_URL}/progress`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` }}).then(res => res.json()).then(setData);
  }, [user, token]);

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}! 👋</h2>
      {data && (
        <div className="stats-grid">
          {user.role === 'student' && (
            <>
              <div className="stat-card"><h3>{data.enrolledCourses}</h3><p>Courses</p></div>
              <div className="stat-card"><h3>{data.completedLessons}</h3><p>Lessons</p></div>
              <div className="stat-card"><h3>{data.completedQuizzes}</h3><p>Quizzes</p></div>
              <div className="stat-card"><h3>{data.totalPoints}</h3><p>Points</p></div>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <div className="stat-card"><h3>{data.totalUsers}</h3><p>Users</p></div>
              <div className="stat-card"><h3>{data.totalCourses}</h3><p>Courses</p></div>
              <div className="stat-card"><h3>{data.activeStudents}</h3><p>Students</p></div>
              <div className="stat-card"><h3>{data.totalEnrollments}</h3><p>Enrollments</p></div>
            </>
          )}
        </div>
      )}
      <button onClick={() => setCurrentPage('courses')} className="action-btn">Browse Courses</button>
      {user.role === 'student' && <button onClick={() => setCurrentPage('my-courses')} className="action-btn">My Courses</button>}
    </div>
  );
}

/* ---------------- Courses Page ---------------- */

function CoursesPage({ user, token }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/courses`).then(res => res.json()).then(setCourses);
  }, []);

  const enroll = async (id) => {
    const res = await fetch(`${API_URL}/courses/${id}/enroll`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) alert('✅ Enrolled!');
  };

  return (
    <div className="courses-page">
      <h2>🎓 Available Courses</h2>
      <div className="courses-grid">
        {courses.map(c => (
          <div key={c.id} className="course-card">
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>📝 {c.lessons?.length || 0} lessons</p>
            {user.role === 'student' && <button onClick={() => enroll(c.id)} className="enroll-btn">Enroll</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- My Courses Page ---------------- */

function MyCoursesPage({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/users/enrolled-courses`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setCourses);
  }, [token]);

  if (selected) return <CourseView course={selected} token={token} onBack={() => setSelected(null)} />;

  return (
    <div className="my-courses-page">
      <h2>📚 My Courses</h2>
      {courses.length === 0 ? <p>No courses yet!</p> : (
        <div className="courses-grid">
          {courses.map(c => (
            <div key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <button onClick={() => setSelected(c)} className="view-btn">Open</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Course View ---------------- */

function CourseView({ course, token, onBack }) {
  const [tab, setTab] = useState('lessons');
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/courses/${course.id}/quizzes`).then(res => res.json()).then(setQuizzes);
  }, [course.id]);

  const complete = async (id) => {
    const res = await fetch(`${API_URL}/lessons/${id}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const d = await res.json();
      alert(`✅ +10 points! Total: ${d.totalPoints}`);
    }
  };

  if (quiz) return <QuizView quiz={quiz} token={token} onBack={() => setQuiz(null)} />;

  return (
    <div className="course-view">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h2>{course.title}</h2>
      <div className="tabs">
        <button className={tab === 'lessons' ? 'active' : ''} onClick={() => setTab('lessons')}>Lessons</button>
        <button className={tab === 'quizzes' ? 'active' : ''} onClick={() => setTab('quizzes')}>Quizzes</button>
      </div>
      {tab === 'lessons' && (
        <div className="lessons-list">
          {course.lessons?.map((l, i) => (
            <div key={l.id} className="lesson-item">
              <h4>Lesson {i + 1}: {l.title}</h4>
              <p>{l.content}</p>
              <button onClick={() => complete(l.id)} className="complete-btn">Complete</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'quizzes' && (
        <div className="quizzes-list">
          {quizzes.map(q => (
            <div key={q.id} className="quiz-item">
              <h4>{q.title}</h4>
              <button onClick={() => setQuiz(q)} className="start-quiz-btn">Start</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Quiz View ---------------- */

function QuizView({ quiz, token, onBack }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const submit = async () => {
    const arr = quiz.questions.map((q, i) => answers[i] ?? -1);
    const res = await fetch(`${API_URL}/quizzes/${quiz.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ answers: arr })
    });
    if (res.ok) setResult(await res.json());
  };

  if (result) {
    return (
      <div className="quiz-result">
        <h2>Results</h2>
        <div className={`result-card ${result.passed ? 'passed' : 'failed'}`}>
          <h3>{result.passed ? '🎉 Passed!' : '📚 Try again!'}</h3>
          <p>Score: {result.score}/{result.totalMarks}</p>
        </div>
        <button onClick={onBack} className="back-btn">Back</button>
      </div>
    );
  }

  return (
    <div className="quiz-view">
      <h2>{quiz.title}</h2>
      <div className="questions">
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="question">
            <h4>Q{i + 1}: {q.text}</h4>
            <div className="options">
              {q.options.map((o, j) => (
                <label key={j} className="option">
                  <input type="radio" name={`q${i}`} onChange={() => setAnswers({...answers, [i]: j})} />
                  {o}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} className="submit-btn">Submit</button>
      <button onClick={onBack} className="back-btn">Cancel</button>
    </div>
  );
}

/* ---------------- Progress Page ---------------- */

function ProgressPage({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/progress`, { headers: { 'Authorization': `Bearer ${token}` }}).then(res => res.json()).then(setData);
  }, [token]);

  return (
    <div className="progress-page">
      <h2>📈 My Progress</h2>
      {data ? (
        <div className="progress-grid">
          <div className="progress-card"><h3>{data.completedLessons}</h3><p>Lessons Completed</p></div>
          <div className="progress-card"><h3>{data.completedQuizzes}</h3><p>Quizzes Completed</p></div>
          <div className="progress-card"><h3>{data.totalPoints}</h3><p>Total Points</p></div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
}

/* ---------------- Admin Page ---------------- */

function AdminPage({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setStats);
  }, [token]);

  return (
    <div className="admin-page">
      <h2>💼 Admin Dashboard</h2>
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
          <div className="stat-card"><h3>{stats.totalCourses}</h3><p>Courses</p></div>
          <div className="stat-card"><h3>{stats.activeStudents}</h3><p>Active Students</p></div>
          <div className="stat-card"><h3>{stats.totalEnrollments}</h3><p>Enrollments</p></div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
}

/* ---------------- Reports Page (New) ---------------- */

function ReportsPage({ user, token }) {
  const [report, setReport] = useState({});
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const url = user.role === 'admin' ? `${API_URL}/admin/reports?range=${dateRange}` : `${API_URL}/users/reports?range=${dateRange}`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setReport);
  }, [dateRange, token, user.role]);

  const downloadReport = () => {
    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techbridge-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="report-header">
        <h2>📊 {user.role === 'admin' ? 'Platform Analytics Report' : 'My Learning Report'}</h2>
        <div className="report-actions">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-filter">
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          <button onClick={downloadReport} className="download-btn">📥 Download Report</button>
        </div>
      </div>
      <pre className="report-content">{JSON.stringify(report, null, 2)}</pre>
      <div className="report-footer-section">
        <p className="report-timestamp">📅 Report generated on {new Date(report.generatedAt || Date.now()).toLocaleString()}</p>
        <p className="report-note">💡 This report is automatically updated based on your latest activities.</p>
      </div>
    </div>
  );
}

/* ---------------- Certificates Page (New) ---------------- */

function CertificatesPage({ user, token }) {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users/certificates`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setCertificates);
  }, [token]);

  const downloadCertificate = (cert) => {
    const certificateContent = `
╔════════════════════════════════════════════════════════════╗
║              🎓 CERTIFICATE OF COMPLETION 🎓               ║
║                         TechBridge                         ║
╠════════════════════════════════════════════════════════════╣
║  This certifies that                                       ║
║  ${cert.studentName.toUpperCase()}                         ║
║  has successfully completed                                ║
║  ${cert.courseName}                                        ║
║                                                            ║
║  Instructor: ${cert.instructor}                            ║
║  Date: ${new Date(cert.completionDate).toLocaleDateString()}║
║  Certificate #: ${cert.certificateNumber}                  ║
╚════════════════════════════════════════════════════════════╝
    `;
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechBridge-Certificate-${cert.certificateNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="certificates-page">
      <h2>🏆 My Certificates</h2>
      <div className="certificates-grid">
        {certificates.map(cert => (
          <div key={cert.certificateNumber} className="certificate-card">
            <h3>{cert.courseName}</h3>
            <p>Instructor: {cert.instructor}</p>
            <p>Completed: {new Date(cert.completionDate).toLocaleDateString()}</p>
            <button onClick={() => downloadCertificate(cert)} className="download-cert-btn">📥 Download Certificate</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Contact Page (New) ---------------- */

function ContactPage() {
  const contactInfo = {
    email: 'support@techbridge.com',
    phone: '+250 790 000 000',
    address: 'Kigali, Rwanda'
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h2>📞 Get in Touch</h2>
        <p>We'd love to hear from you! Reach out with any questions or feedback.</p>
      </div>
      <div className="contact-content-wrapper">
        {contactInfo && (
          <div className="contact-info-section">
            <div className="info-card-large">
              <h3>📍 Our Location</h3>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <p className="label">Email</p>
                  <p className="value">{contactInfo.email}</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <p className="label">Phone</p>
                  <p className="value">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📌</span>
                <div>
                  <p className="label">Address</p>
                  <p className="value">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="info-card-large">
              <h3>❓ Frequently Asked</h3>
              <div className="faq-list">
                <div className="faq-item">
                  <p className="faq-question">How do I enroll in a course?</p>
                  <p className="faq-answer">Browse courses and click "Enroll Now"</p>
                </div>
                <div className="faq-item">
                  <p className="faq-question">Are certificates free?</p>
                  <p className="faq-answer">Yes! Complete all requirements to earn free certificates</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- About Page (New) ---------------- */

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h2>ℹ️ About TechBridge</h2>
        <p className="hero-subtitle">Empowering the next generation of tech professionals</p>
      </div>
      <div className="about-content">
        <p>TechBridge is a platform that provides high-quality digital skills courses, interactive quizzes, progress tracking, and certifications. Our mission is to empower learners across Africa to bridge the digital skills gap and thrive in the modern economy.</p>
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} TechBridge. All rights reserved.</p>
    </footer>
  );
}

export default App;
