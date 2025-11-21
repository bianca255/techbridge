// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  duration: Number,
  totalMarks: Number,
  passingScore: Number,
  questions: [
    {
      id: Number,
      text: String,
      options: [String],
      correctAnswer: Number
    }
  ]
});

module.exports = mongoose.model('Quiz', quizSchema);
