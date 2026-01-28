require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// connect to DB
connectDB();

// INDUCES flow for Tasks (basic REST mapping)
// Index  -> GET    /tasks
// New    -> GET    /tasks/new
// Create -> POST   /tasks
// Show   -> GET    /tasks/:id
// Edit   -> GET    /tasks/:id/edit
// Update -> PUT    /tasks/:id
// Delete -> DELETE /tasks/:id

app.get('/', (req, res) => {
  res.json({ message: 'TaskMaster API (Tasks) — INDUCES flow' });
});

// INDEX
app.get('/tasks', async (req, res) => {
  require('dotenv').config();
  const express = require('express');
  const connectDB = require('./config/db');
  const Task = require('./models/Task');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // connect to DB
  connectDB();

  // INDUCES flow for Tasks (basic REST mapping)
  // Index  -> GET    /tasks
  // New    -> GET    /tasks/new
  // Create -> POST   /tasks
  // Show   -> GET    /tasks/:id
  // Edit   -> GET    /tasks/:id/edit
  // Update -> PUT    /tasks/:id
  // Delete -> DELETE /tasks/:id

  app.get('/', (req, res) => {
    res.json({ message: 'TaskMaster API (Tasks) — INDUCES flow' });
  });

  // INDEX
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find({});
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // NEW (returns a minimal example for client forms)
  app.get('/tasks/new', (req, res) => {
    res.json({
      example: { title: 'My Task', description: 'Details', status: 'To Do', project: 'projectId' }
    });
  });

  // CREATE
  app.post('/tasks', async (req, res) => {
    const { title, description, status, project } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'title and project are required' });
    try {
      const task = await Task.create({ title, description, status, project });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // SHOW
  app.get('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Not found' });
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // EDIT (return current task for editing)
  app.get('/tasks/:id/edit', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Not found' });
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // UPDATE
  app.put('/tasks/:id', async (req, res) => {
    try {
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // DELETE
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const deleted = await Task.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));