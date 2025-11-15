import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import Courses from './components/Courses';
import About from './components/About';
import Auth from './components/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'courses':
        return <Courses courses={courses} loading={loading} error={error} apiUrl={API_URL} />;
      case 'about':
        return <About />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">TechBridge</div>
          <ul className="nav-menu">
            <li><button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button></li>
            <li><button onClick={() => setCurrentPage('courses')} className={currentPage === 'courses' ? 'active' : ''}>Courses</button></li>
            <li><button onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'active' : ''}>About</button></li>
            {user ? (
              <>
                <li><span className="user-info">Welcome, {user.name}!</span></li>
                <li><button onClick={logout} className="btn-logout">Logout</button></li>
              </>
            ) : (
              <li><button onClick={() => setShowAuth(true)} className="btn-login">Login / Sign Up</button></li>
            )}
          </ul>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 TechBridge. All rights reserved. | Digital Skills Enhancement Platform</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
