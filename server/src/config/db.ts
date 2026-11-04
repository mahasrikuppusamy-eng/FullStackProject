import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Place } from '../models/Place.js';
import { Review } from '../models/Review.js';
import { SEED_USERS, SEED_PLACES, SEED_REVIEWS } from '../seed/seedData.js';

let isMongooseConnected = false;

// Fallback in-memory database store if MongoDB Atlas is unavailable or offline
export const memoryStore = {
  users: [] as any[],
  places: [] as any[],
  reviews: [] as any[],
};

export async function initMemoryStore() {
  memoryStore.users = await Promise.all(
    SEED_USERS.map(async (u) => {
      const passwordHash = await bcrypt.hash(u.password, 10);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  memoryStore.places = JSON.parse(JSON.stringify(SEED_PLACES)).map((p: any) => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  memoryStore.reviews = JSON.parse(JSON.stringify(SEED_REVIEWS)).map((r: any) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.createdAt),
  }));
}

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('<password>')) {
    console.log('ℹ️ No active MONGO_URI detected. Running with in-memory database store with 15 Coimbatore places.');
    await initMemoryStore();
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongooseConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    // Check if seeding is needed
    const count = await Place.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial 15 Coimbatore places to MongoDB...');
      await seedDatabase();
    }
    return true;
  } catch (error: any) {
    console.warn('⚠️ MongoDB connection failed:', error.message);
    console.log('ℹ️ Falling back to in-memory store so app stays 100% functional.');
    isMongooseConnected = false;
    await initMemoryStore();
    return false;
  }
}

export function isDbConnected(): boolean {
  return isMongooseConnected && mongoose.connection.readyState === 1;
}

export async function seedDatabase() {
  if (isDbConnected()) {
    // Wipe existing
    await User.deleteMany({});
    await Place.deleteMany({});
    await Review.deleteMany({});

    // Seed users with hashed passwords
    const userDocs = await Promise.all(
      SEED_USERS.map(async (u) => {
        const passwordHash = await bcrypt.hash(u.password, 10);
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
        };
      })
    );
    await User.insertMany(userDocs);

    // Seed places
    await Place.insertMany(SEED_PLACES);

    // Seed reviews
    await Review.insertMany(SEED_REVIEWS);

    console.log('✅ Seed completed: 3 users, 15 Coimbatore places, 6 reviews inserted.');
  } else {
    await initMemoryStore();
    console.log('✅ In-memory database reset to initial 15 Coimbatore places.');
  }
}
