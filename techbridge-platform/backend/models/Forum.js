const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  topic: String,
  posts: [{ authorId: mongoose.Schema.Types.ObjectId, author: String, content: String, timestamp: Date, replies: Array }]
});

module.exports = mongoose.model('Forum', forumSchema);
