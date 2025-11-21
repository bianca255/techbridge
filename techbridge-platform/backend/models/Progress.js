const { Schema, model } = require('mongoose');

const progressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  completedLessons: [String],
  pointsEarned: { type: Number, default: 0 },
});

module.exports = model('Progress', progressSchema);
