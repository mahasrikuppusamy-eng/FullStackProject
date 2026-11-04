import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, seedDatabase } from '../config/db.js';
import mongoose from 'mongoose';

// Load .env
dotenv.config();

async function runSeed() {
  console.log('🚀 Running Coimbatore AccessAble Database Seed Script...');
  await connectDB();
  await seedDatabase();
  console.log('🎉 Seeding completed successfully!');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
