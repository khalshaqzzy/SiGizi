
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LogisticsProvider from '../src/models/LogisticsProvider';
import PosyanduRegistry from '../src/models/PosyanduRegistry';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sigizi_logistics');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const run = async () => {
    await connectDB();

    console.log('Ensuring Indexes for LogisticsProvider...');
    try {
        await LogisticsProvider.ensureIndexes();
        console.log('✅ LogisticsProvider indexes ensured.');
    } catch (e) {
        console.error('❌ Error LogisticsProvider:', e);
    }

    console.log('Ensuring Indexes for PosyanduRegistry...');
    try {
        await PosyanduRegistry.ensureIndexes();
        console.log('✅ PosyanduRegistry indexes ensured.');
    } catch (e) {
        console.error('❌ Error PosyanduRegistry:', e);
    }

    process.exit();
};

run();
