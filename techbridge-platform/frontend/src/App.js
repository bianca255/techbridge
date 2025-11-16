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
        {user && user.role === 'admin' && currentPage === 'admin' && <AdminPage token={token} />}
      </main>
      <Footer />
    </div>
  );
}

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
              {user.role === 'admin' && <button onClick={() => onNavigate('admin')}>Admin</button>}
              <span className="user-info">{user.name} ({user.role})</span>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}>Login</button>
              <button onClick={() => onNavigate('register')}>Register</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

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

function ProgressPage({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/progress`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setData);
  }, [token]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="progress-page">
      <h2>📈 Progress</h2>
      <div className="progress-stats">
        <div className="progress-card"><h3>{data.enrolledCourses}</h3><p>Courses</p></div>
        <div className="progress-card"><h3>{data.completedLessons}</h3><p>Lessons</p></div>
        <div className="progress-card"><h3>{data.completedQuizzes}</h3><p>Quizzes</p></div>
        <div className="progress-card"><h3>{data.totalPoints}</h3><p>Points</p></div>
      </div>
    </div>
  );
}

function AdminPage({ token }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => res.json()).then(setUsers);
  }, [token]);

  return (
    <div className="admin-page">
      <h2>👨‍💼 Admin</h2>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footer() {
  return <footer className="footer"><p>© 2024 TechBridge</p></footer>;
}

export default App;