import { Response } from 'express';
import Joi from 'joi';
import { supabase } from '../config/database';
import { AuthRequest, generateToken } from '../middleware/auth';
import { AppError } from '../middleware/error';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(2).max(100).optional()
});

// Simple mock authentication (in production, use Supabase Auth)
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🔐 Login attempt for email:', req.body.email);

    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      throw new AppError(error.details[0].message, 400);
    }

    const { email, password } = req.body;

    // Check if user exists
    console.log('🔍 Checking if user exists in database...');
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Database error:', fetchError);
      throw new AppError('Database error', 500);
    }

    // For demo: accept any login, create user if doesn't exist
    // In production, verify password properly
    let user = existingUser;

    if (!user) {
      console.log('👤 User not found, creating new user...');
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          username: email.split('@')[0],
          last_login_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Failed to create user:', createError);
        console.error('   Error details:', createError);
        throw new AppError('Failed to create user', 500);
      }

      console.log('✅ User created successfully:', newUser.id);
      user = newUser;
    } else {
      console.log('✅ User found:', user.id);
      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    const token = generateToken(user.id, user.email);
    console.log('🎫 Generated token for user:', user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('❌ Unexpected login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email,
        username: username || email.split('@')[0]
      })
      .select()
      .single();

    if (createError || !newUser) {
      throw new AppError('Failed to create user', 500);
    }

    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        preferences: newUser.preferences
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar_url: user.avatar_url,
      role: user.role,
      preferences: user.preferences,
      reading_goal: user.reading_goal,
      created_at: user.created_at
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { username, avatar_url, preferences, reading_goal } = req.body;

    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (reading_goal !== undefined) updateData.reading_goal = reading_goal;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.userId)
      .select()
      .single();

    if (error || !user) {
      throw new AppError('Failed to update profile', 500);
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar_url: user.avatar_url,
      role: user.role,
      preferences: user.preferences,
      reading_goal: user.reading_goal
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
