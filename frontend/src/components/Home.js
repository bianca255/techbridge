import React from 'react';

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to TechBridge</h1>
        <p className="subtitle">Empower Your Digital Skills Journey</p>
        <p className="description">
          Learn programming, web development, and digital skills from industry experts.
          Start your journey towards becoming a tech professional today.
        </p>
        <div className="cta-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <h3>🎓 Expert Instructors</h3>
          <p>Learn from industry professionals with years of experience</p>
        </div>
        <div className="feature">
          <h3>💻 Hands-On Projects</h3>
          <p>Build real-world projects and gain practical skills</p>
        </div>
        <div className="feature">
          <h3>🏆 Certifications</h3>
          <p>Earn recognized certificates to boost your career</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
