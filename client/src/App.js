import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/todolist" element={<TodoList />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
