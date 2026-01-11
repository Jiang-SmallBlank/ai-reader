import { Request, Response, NextFunction } from 'express';

// 开发环境日志中间件
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  if (req.method !== 'GET') {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }

  next();
};

// 错误日志
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error('  Stack:', err.stack);
  console.error('  Request:', req.method, req.path);
  next(err);
};
