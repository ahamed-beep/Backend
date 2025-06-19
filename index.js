import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userroutes from './Routes/userroutes.js';
import dbconnection from './Connection/db_connection.js';

dotenv.config();
dbconnection();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: ['https://inspiring-dodol-f165f9.netlify.app', 'http://localhost:5173'],
  credentials: true
}));

// Add body parser with 100MB limit
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: "✅ Backend is working fine!" });
});

// Routes
app.use('/api', userroutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle payload too large errors specifically
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'File size exceeds 100MB limit' });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});