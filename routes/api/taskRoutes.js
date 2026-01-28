const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

// Create task under a project (verify ownership)
router.post('/projects/:projectId/tasks', auth, async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const task = await Task.create({ title, description, status, project: projectId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a project (verify ownership)
router.get('/projects/:projectId/tasks', auth, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (check parent project ownership)
router.put('/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Parent project not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (check parent project ownership)
router.delete('/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Parent project not found' });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await task.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
