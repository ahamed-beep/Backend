import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userroutes from './Routes/userroutes.js';
import dbconnection from './Connection/db_connection.js';

dotenv.config();
dbconnection();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://new-work-heritage.netlify.app'  // ✅ new domain
  ],
  credentials: true
}));




app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.get('/api/test', (req, res) => {
  res.json({ message: "✅ Backend is working fine!" });
});

app.use('/api', userroutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'File size exceeds 100MB limit' });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});