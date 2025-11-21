const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  title: String,
  description: String,
  lessons: [String],
  points: { type: Number, default: 10 },
});

module.exports = model('Course', courseSchema);
