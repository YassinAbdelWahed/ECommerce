import { randomUUID } from 'crypto';
import { diskStorage, memoryStorage } from 'multer';
import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { tmpdir } from 'os';
import { StorageEnum } from 'src/common/enums/multer.enum';

export const cloudFileUpload = ({
  storageApproach = StorageEnum.memory,
  validation = [],
  fileSize = 2,
}: {
  validation: string[];
  fileSize?: number;
  storageApproach?: StorageEnum;
}): MulterOptions => {
  return {
    storage:
      storageApproach === StorageEnum.memory
        ? memoryStorage()
        : diskStorage({
            destination: tmpdir(),
            filename: function (
              req: Request,
              file: Express.Multer.File,
              callback,
            ) {
              callback(null, `${randomUUID()}_${file.originalname}`);
            },
          }),

    fileFilter(req: Request, file: Express.Multer.File, callback: Function) {
      console.log('File mimetype:', file.mimetype);
      if (validation.includes(file.mimetype)) {
        return callback(null, true);
      }
      return callback(new BadRequestException('Invalid File Format'));
    },

    limits: {
      fileSize: fileSize * 1024 * 1024,
    },
  };
};
