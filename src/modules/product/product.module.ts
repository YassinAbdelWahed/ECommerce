import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { BrandModel, CategoryModel } from 'src/DB';
import { ProductModel } from 'src/DB/model/product.model';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { CategoryRepository } from 'src/DB/repository/category.repository';
import { BrandRepository } from 'src/DB/repository/brand.repository';
import { S3Service } from 'src/common';

@Module({
  imports: [CategoryModel, ProductModel, BrandModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    BrandRepository,
    S3Service,
  ],
})
export class ProductModule {}
