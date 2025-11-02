import {
  Controller,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RoleEnum } from 'src/common/enums';
import {
  Auth,
  fileValidation,
  IResponse,
  IUser,
  localFileUpload,
  PreferredLanguageInterceptor,
  successResponse,
  User,
} from 'src/common';
import type { UserDocument } from 'src/DB';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import type { IMulterFile } from '../../common/interfaces/multer.interface';
import { cloudFileUpload } from 'src/common/utils/multer/cloud.multer';
import { StorageEnum } from 'src/common/enums/multer.enum';
import { ProfileResponse } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(PreferredLanguageInterceptor)
  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get()
  profile(
    @Headers() header: any,
    @User() user: UserDocument,
  ): {
    message: string;
  } {
    console.log({
      lang: header['accept-language'],
      user,
    });
    return { message: 'Done' };
  }

  @UseInterceptors(
    FileInterceptor(
      'profileImage',
      cloudFileUpload({
        storageApproach: StorageEnum.disk,
        validation: fileValidation.image,
        fileSize: 2,
      }),
    ),
  )
  @Auth([RoleEnum.user])
  @Patch('profile-image')
  async profileImage(
    @User() user: UserDocument,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<IResponse<ProfileResponse>> {
    const profile = await this.userService.profileImage(file, user);
    return successResponse<ProfileResponse>({ data: { profile } });
  }

  @UseInterceptors(
    FilesInterceptor(
      'coverImages',
      2,
      localFileUpload({
        folder: 'user/profile-images',
        validation: fileValidation.image,
        fileSize: 2,
      }),
    ),
  )
  @Auth([RoleEnum.user])
  @Patch('cover-image')
  coverImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
        fileIsRequired: true,
      }),
    )
    file: IMulterFile,
  ) {
    return { message: 'Done', file };
  }
}
