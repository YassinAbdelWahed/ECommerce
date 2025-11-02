import type { NextFunction, Request, Response } from 'express';
import { TokenEnum } from '../enums';

export const setDefaultLanguage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('defaultLanguage.........');
  req.headers['accept-language'] = req.headers['accept-language'] ?? 'EN';
  next();
};


