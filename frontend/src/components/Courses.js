import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Courses({ courses, loading, error, apiUrl }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [progress, setProgress] = useState(null);
  const [forumPosts, setForumPosts] = useState([]);
  const [message, setMessage] = useState('');
  const { token, user } = useAuth();

  const showCourseDetails = async (course) => {
    setSelectedCourse(course);
    // Fetch quiz
    const quizRes = await fetch(`${apiUrl}/quiz/${course._id}`);
    setQuiz(await quizRes.json());
    // Fetch progress
    if (token) {
      const progRes = await fetch(`${apiUrl}/progress/${course._id}`, {
        headers: { Authorization: token },
      });
      setProgress(await progRes.json());
    }
    // Fetch forum
    const forumRes = await fetch(`${apiUrl}/forum/${course._id}`);
    setForumPosts(await forumRes.json());
  };

  const submitQuiz = async (score) => {
    await fetch(`${apiUrl}/quiz/${selectedCourse._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ score }),
    });
    alert('Quiz submitted!');
  };

  const postMessage = async () => {
    await fetch(`${apiUrl}/forum/${selectedCourse._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ message }),
    });
    setMessage('');
    const forumRes = await fetch(`${apiUrl}/forum/${selectedCourse._id}`);
    setForumPosts(await forumRes.json());
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="courses-section">
      <h2>Our Courses</h2>
      <p className="section-subtitle">Choose from our wide range of digital skill courses</p>
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => showCourseDetails(course)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="no-courses">No courses available yet. Check back soon!</p>
        )}
      </div>
      {selectedCourse && (
        <div className="course-details">
          <h3>{selectedCourse.title}</h3>
          <p>{selectedCourse.description}</p>
          <h4>Lessons</h4>
          <ul>
            {selectedCourse.lessons.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <h4>Progress</h4>
          <pre>{JSON.stringify(progress, null, 2)}</pre>
          <h4>Quiz</h4>
          {quiz && quiz.questions && (
            <div>
              {quiz.questions.map((q, i) => (
                <div key={i}>
                  <p>{q.question}</p>
                  {q.options.map((opt, idx) => (
                    <label key={idx}>
                      <input type="radio" name={`q${i}`} value={idx} /> {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button onClick={() => submitQuiz(Math.floor(Math.random() * 100))}>Submit Quiz (Demo)</button>
            </div>
          )}
          <h4>Forum</h4>
          <ul>
            {forumPosts.map((p, i) => (
              <li key={i}>{p.message}</li>
            ))}
          </ul>
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type message" />
          <button onClick={postMessage}>Post</button>
        </div>
      )}
    </section>
  );
}

export default Courses;
