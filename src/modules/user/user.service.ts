import { Injectable } from '@nestjs/common';
import { IUser, S3Service } from 'src/common';
import { StorageEnum } from 'src/common/enums/multer.enum';
import type { UserDocument } from 'src/DB';

@Injectable()
export class UserService {
  constructor(private readonly s3Service: S3Service) {}

  profile(): string {
    return 'done';
  }

  async profileImage(
    file: Express.Multer.File,
    user: UserDocument,
  ): Promise<UserDocument> {
    user.profilePicture = await this.s3Service.uploadFile({
      file,
      storageApproach: StorageEnum.disk,
      path: `user/${user._id.toString()}`,
    });
    await user.save();
    return user;
  }
}
