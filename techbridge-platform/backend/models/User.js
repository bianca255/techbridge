const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' }, // student, teacher, admin
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  totalPoints: { type: Number, default: 0 },
});

module.exports = model('User', userSchema);
