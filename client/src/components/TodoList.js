import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null); // To track if we're editing a todo
  const [editText, setEditText] = useState(''); // For updating the todo text
  const [error, setError] = useState(null); // For error handling

  // Fetch todos
  const fetchTodos = async () => {
    const token = localStorage.getItem('token');

    // Add console logs to debug
    console.log('token:', token);

    if (!token) {
      console.error('Token not found');
      setError('You must be logged in to see your todos.');
      return;
    }

    try {
      const response = await axios.get('https://mern-todo-app-auqo.onrender.com/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched todos:', response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos. Please try again later.');
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!text.trim()) {
      setError('Todo text cannot be empty.');
      return;
    }

    try {
      await axios.post('https://mern-todo-app-auqo.onrender.com/api/todos', { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setText(''); // Clear the input
      fetchTodos(); // Refresh todo list after adding a new todo
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  // Mark a todo as completed or not
  const completeTodo = async (todoId, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://mern-todo-app-auqo.onrender.com/api/todos/${todoId}`, { completed: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos(); // Refresh the todo list after updating
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  // Delete a todo
  const deleteTodo = async (todoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://mern-todo-app-auqo.onrender.com/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos(); // Refresh the todo list after deletion
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  // Update a todo
  const updateTodo = async (todoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://mern-todo-app-auqo.onrender.com/api/todos/${todoId}`, { text: editText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTodoId(null); // Stop editing
      setEditText(''); // Clear the edit input
      fetchTodos(); // Refresh todo list after updating
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  // Load todos when the component is mounted
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}

      <form onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {editTodoId === todo._id ? (
              <div>
                <input 
                  type="text" 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)} 
                />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
                <button onClick={() => setEditTodoId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{todo.text}</span>
                <button onClick={() => completeTodo(todo._id, todo.completed)}>Done</button> {/* Button to mark as done */}
                <button onClick={() => { setEditTodoId(todo._id); setEditText(todo.text); }}>
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
