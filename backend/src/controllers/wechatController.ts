import { Response } from 'express';
import { supabase } from '../config/database';
import { AuthRequest, generateToken } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { randomUUID } from 'crypto';

// Store QR code login sessions (in production, use Redis)
const qrSessions = new Map<string, {
  userId: string | null;
  createdAt: number;
  status: 'pending' | 'scanned' | 'confirmed' | 'expired';
}>();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  const expiredTime = 5 * 60 * 1000; // 5 minutes

  for (const [key, session] of qrSessions.entries()) {
    if (now - session.createdAt > expiredTime) {
      session.status = 'expired';
    }
  }
}, 60 * 1000);

/**
 * Generate WeChat QR code for login
 * POST /api/auth/wechat/qrcode
 */
export const generateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Generate a unique session ID
    const sessionId = randomUUID();

    // Store session
    qrSessions.set(sessionId, {
      userId: null,
      createdAt: Date.now(),
      status: 'pending'
    });

    // In production, you would:
    // 1. Call WeChat Open Platform API to get QR code
    // 2. Return the actual QR code image URL or base64
    // const qrCodeUrl = await wechatAPI.getQRCode(sessionId);

    // For demo, return a QR code API URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ai-reader-${sessionId}`;

    res.json({
      sessionId,
      qrCodeUrl,
      expiresInSeconds: 300 // 5 minutes
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new AppError('Failed to generate QR code', 500);
  }
};

/**
 * Check QR code scan status
 * GET /api/auth/wechat/status/:sessionId
 */
export const checkQRStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = qrSessions.get(sessionId);

    if (!session) {
      res.json({ status: 'expired' });
      return;
    }

    // Check if expired
    const now = Date.now();
    if (now - session.createdAt > 5 * 60 * 1000) {
      session.status = 'expired';
      qrSessions.delete(sessionId);
      res.json({ status: 'expired' });
      return;
    }

    // If confirmed and has user, return token
    if (session.status === 'confirmed' && session.userId) {
      // Get user data
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.userId)
        .single();

      if (user) {
        const token = generateToken(user.id, user.email);

        // Clean up session
        qrSessions.delete(sessionId);

        res.json({
          status: 'confirmed',
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
        return;
      }
    }

    res.json({ status: session.status });
  } catch (error) {
    console.error('Error checking QR status:', error);
    throw new AppError('Failed to check QR status', 500);
  }
};

/**
 * Simulate WeChat callback (for demo/testing)
 * In production, this would be called by WeChat Open Platform
 * POST /api/auth/wechat/callback
 */
export const wechatCallback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, code, openid } = req.body;

    if (!sessionId || !openid) {
      throw new AppError('Missing required parameters', 400);
    }

    const session = qrSessions.get(sessionId);

    if (!session || session.status === 'expired') {
      throw new AppError('Invalid or expired session', 400);
    }

    // In production, you would:
    // 1. Verify the code with WeChat API
    // 2. Get user info from WeChat
    // const wechatUser = await wechatAPI.getUserInfo(code);

    // For demo, find or create user by openid
    let userId: string;

    // Check if user exists with this WeChat openid
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', `wechat_${openid}@demo.ai-reader.com`)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email: `wechat_${openid}@demo.ai-reader.com`,
          username: `微信用户${openid.slice(-6)}`,
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + openid,
          role: 'free'
        })
        .select()
        .single();

      userId = newUser!.id;
    }

    // Update session
    session.userId = userId;
    session.status = 'scanned';

    res.json({ success: true });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Confirm WeChat login (user confirms on mobile)
 * POST /api/auth/wechat/confirm
 */
export const confirmWeChatLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;

    const session = qrSessions.get(sessionId);

    if (!session || session.status !== 'scanned') {
      throw new AppError('Invalid session', 400);
    }

    session.status = 'confirmed';

    res.json({ success: true });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Demo endpoint: Simulate scanning QR code
 * POST /api/auth/wechat/demo/scan
 */
export const demoScanQR = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;

    const session = qrSessions.get(sessionId);

    if (!session) {
      throw new AppError('Invalid session', 400);
    }

    // Simulate scanning with demo user
    const demoOpenId = 'demo_wechat_user_12345';

    // Find or create demo user
    let userId: string;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'demo@example.com')
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email: 'demo@example.com',
          username: '演示用户',
          role: 'premium'
        })
        .select()
        .single();

      userId = newUser!.id;
    }

    session.userId = userId;
    session.status = 'confirmed';

    res.json({ success: true, message: 'QR code scanned (demo)' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
