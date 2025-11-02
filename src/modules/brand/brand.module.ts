import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandModel} from 'src/DB';
import { S3Service } from 'src/common';
import { BrandRepository } from 'src/DB/repository/brand.repository';

@Module({
  imports: [BrandModel],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, S3Service ],
})
export class BrandModule {}
