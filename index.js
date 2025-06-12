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
  origin: 'https://inspiring-dodol-f165f9.netlify.app', 
  credentials: true
}));


app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: "✅ Backend is working fine!" });
});

app.use('/api', userroutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

