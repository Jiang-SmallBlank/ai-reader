import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const details = error.details.map(detail => detail.message);
      res.status(400).json({
        error: 'Validation failed',
        details
      });
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);

    if (error) {
      const details = error.details.map(detail => detail.message);
      res.status(400).json({
        error: 'Validation failed',
        details
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  uuid: Joi.string().uuid().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};
