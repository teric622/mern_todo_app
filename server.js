const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS options to allow requests from your frontend
const corsOptions = {
  origin: 'https://mern-todo-app-1-pwmp.onrender.com/', // Update to your frontend URL
  credentials: true, // Optional: if you need to allow cookies or authentication headers
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use Todo and User routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes); // Connect user routes

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
