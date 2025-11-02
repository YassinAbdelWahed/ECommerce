import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import type { Response, NextFunction, Request } from 'express';
import { TokenService } from '../service';
import { TokenEnum } from '../enums';
import type { IAuthRequest } from '../interfaces/token.interface';

export const preAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('preAUTH');
  if (!(req.headers.authorization?.split(' ')?.length == 2)) {
    throw new ForbiddenException('Missing Authorization Key');
  }
  next();
};
