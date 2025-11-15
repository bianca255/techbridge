// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Import pages if they are in separate files
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import Dashboard from './pages/Dashboard';
// import CoursesPage from './pages/CoursesPage';
// import MyCoursesPage from './pages/MyCoursesPage';
// import ProgressPage from './pages/ProgressPage';
// import AdminPage from './pages/AdminPage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) fetchCurrentUser();
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setCurrentPage('dashboard');
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

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
        {!user && currentPage === 'login' && (
          <LoginPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />
        )}
        {!user && currentPage === 'register' && (
          <RegisterPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />
        )}
        {user && currentPage === 'dashboard' && (
          <Dashboard user={user} token={token} setCurrentPage={setCurrentPage} />
        )}
        {user && currentPage === 'courses' && (
          <CoursesPage user={user} token={token} setCurrentPage={setCurrentPage} />
        )}
        {user && currentPage === 'my-courses' && (
          <MyCoursesPage user={user} token={token} setCurrentPage={setCurrentPage} />
        )}
        {user && currentPage === 'progress' && (
          <ProgressPage user={user} token={token} />
        )}
        {user && user.role === 'admin' && currentPage === 'admin' && (
          <AdminPage token={token} />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Header
function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => onNavigate(user ? 'dashboard' : 'login')}>
          🎓 TechBridge
        </h1>
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

// Footer
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 TechBridge Learning Platform. All rights reserved.</p>
      <p>Empowering learners through digital skills education</p>
    </footer>
  );
}

export default App;
