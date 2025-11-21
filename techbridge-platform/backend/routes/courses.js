const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Add a course
router.post('/', async (req, res) => {
  const { title, description, lessons, points } = req.body;
  const course = await Course.create({ title, description, lessons, points });
  res.status(201).json(course);
});

module.exports = router;
