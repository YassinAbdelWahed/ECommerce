import type { NextFunction, Request, Response } from 'express';

export const setDefaultLanguage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('defaultLanguage.........');

  next();
};