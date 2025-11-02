import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { S3Service } from './common';
import type { Response } from 'express';

import { promisify } from 'node:util';
import { pipeline } from 'node:stream';

const createS3WriteStreamPipe = promisify(pipeline);

//* localhost:3000/
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hi')
  sayHi(): string {
    return 'Hello';
  }

  @Get('/upload/pre-signed/*path')
  async getPresignedAssetUrl(
    @Query() query: { download?: 'true' | 'false'; fileName?: string },
    @Param() params: { path: string[] },
  ) {
    const { download, fileName } = query;
    const { path } = params;
    const Key = path.join('/');
    const url = await this.s3Service.createGetPreSignedLink({
      Key,
      download,
      downloadName: fileName,
    });
    return { message: 'Done', data: { url } };
  }

  @Get('/upload/*path')
  async getAsset(
    @Query() query: { download?: 'true' | 'false'; fileName?: string },
    @Param() params: { path: string[] },
    @Res() res: Response,
  ) {
    const { download, fileName } = query;
    const { path } = params;
    const Key = path.join('/');
    const s3Response = await this.s3Service.getFile({ Key });
    // console.log(s3Response.Body);
    if (!s3Response) {
      throw new BadRequestException('Fail To Fetch This Asset');
    }

    res.setHeader(
      'Content-Type',
      `${s3Response.ContentType}` || 'application/octet-stream',
    );

    if (download === 'true') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName || Key.split('/').pop()}"`,
      );
    }
    return await createS3WriteStreamPipe(
      s3Response.Body as NodeJS.ReadableStream,
      res,
    );
  }
}
