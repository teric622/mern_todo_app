const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Options
const corsOptions = {
  origin: 'https://mern-todo-app-1-pwmp.onrender.com', // Your frontend URL
  credentials: true, // Enable cookies, if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
};

app.use(cors(corsOptions)); // Use CORS with options
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
app.use('/api/users', userRoutes);

// Preflight request handling (optional)
app.options('*', cors(corsOptions)); // Allow preflight requests for all routes

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
