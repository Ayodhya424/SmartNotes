const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/notes', noteRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notesapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});