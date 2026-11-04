import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'accessable_jwt_secret_dev_cbe_2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
      });

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // Memory store fallback
      const existing = memoryStore.users.find((u) => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: 'mem_user_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.users.push(newUser);

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // Memory store fallback
      const user = memoryStore.users.find((u) => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (isDbConnected()) {
      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      const user = memoryStore.users.find((u) => u._id === req.user?.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving user',
    });
  }
}
