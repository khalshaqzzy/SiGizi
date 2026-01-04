import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import interventionRoutes from './routes/interventionRoutes';
import internalRoutes from './routes/internalRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001; // Health service on 5001, Logistics on 5002

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/internal', internalRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('SiGizi Health Microservice is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
