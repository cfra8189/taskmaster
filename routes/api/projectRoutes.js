const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth');
const Project = require('../../models/Project');

// Create project (owner from req.user.id)
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  try {
    const project = await Project.create({ name, description, user: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project (ownership check)
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (ownership check)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    project.name = req.body.name ?? project.name;
    project.description = req.body.description ?? project.description;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (ownership check)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await project.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
