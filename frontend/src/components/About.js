import React from 'react';

function About() {
  return (
    <section className="about-section">
      <h2>About TechBridge</h2>
      <div className="about-content">
        <div className="about-text">
          <h3>Our Mission</h3>
          <p>
            TechBridge is dedicated to empowering individuals with the digital skills needed
            to succeed in the modern workforce. We believe that quality education should be
            accessible, affordable, and engaging for everyone.
          </p>
          <h3>What We Offer</h3>
          <ul>
            <li>Comprehensive courses in programming and web development</li>
            <li>Expert instruction from industry professionals</li>
            <li>Hands-on projects and real-world applications</li>
            <li>Lifetime access to course materials</li>
            <li>Recognized certificates upon completion</li>
            <li>Community support and networking opportunities</li>
          </ul>
          <h3>Our Story</h3>
          <p>
            Founded in 2024, TechBridge has quickly become a trusted platform for digital
            skill development. Our team is passionate about making technology education
            accessible to learners worldwide, regardless of their background or experience level.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat">
            <h4>500+</h4>
            <p>Active Students</p>
          </div>
          <div className="stat">
            <h4>25+</h4>
            <p>Expert Instructors</p>
          </div>
          <div className="stat">
            <h4>50+</h4>
            <p>Courses Offered</p>
          </div>
          <div className="stat">
            <h4>95%</h4>
            <p>Student Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
