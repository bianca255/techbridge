import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Auth({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const { signup, login, loading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isSignup
      ? await signup(formData.email, formData.password, formData.name)
      : await login(formData.email, formData.password);

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-card">
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="toggle-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => setIsSignup(!isSignup)} className="toggle-btn">
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
    </div>
  );
}

export default Auth;
