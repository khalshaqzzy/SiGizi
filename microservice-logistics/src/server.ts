import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import internalRoutes from './routes/internalRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import driverRoutes from './routes/driverRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internal', internalRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/drivers', driverRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('SiGizi Logistics Microservice is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
