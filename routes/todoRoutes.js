const express = require('express');
const Todo = require('../models/todo');
const { authenticateToken } = require('../middleware/auth'); // Ensure this path is correct
 // Make sure to import your token authentication middleware
const router = express.Router();






// POST a new todo (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { text } = req.body; // Destructure body for clarity

  // Use user ID from the token
  const userId = req.user; // Assuming req.user has the user ID from token

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const newTodo = new Todo({
    text,
    user: userId, // Use user ID from the token
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
});


// GET all todos for a specific user


// GET all todos for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user; // Assuming req.user contains the user ID

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  try {
      const todos = await Todo.find({ user: userId });
      res.json(todos);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
});



// PUT (update) a todo
// PUT (update) a todo
router.put('/:id', async (req, res) => {
  try {
    // Check if the request body contains the completed status
    if (req.body.completed !== undefined) {
      // If provided, toggle the completed status
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed }, // Update the completed field
        { new: true }
      );
      
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      return res.json(updatedTodo);
    }

    // If no completed field is provided, update the other fields (like text)
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
    
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
});


// DELETE a todo
router.delete('/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
});

module.exports = router;
