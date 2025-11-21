const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get user progress
router.get('/:userId', async (req, res) => {
  const progress = await Progress.find({ user: req.params.userId }).populate('course');
  res.json(progress);
});

// Add/update progress
router.post('/', async (req, res) => {
  const { user, course, completedLessons, pointsEarned } = req.body;
  const progress = await Progress.create({ user, course, completedLessons, pointsEarned });
  res.status(201).json(progress);
});

module.exports = router;
