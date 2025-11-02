import { Module } from "@nestjs/common";
import { BrandModel,  CategoryModel, } from "src/DB";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { S3Service } from "src/common";
import { CategoryRepository } from "src/DB/repository/category.repository";
import { BrandRepository } from "src/DB/repository/brand.repository";


@Module({
  imports: [
    CategoryModel, 
    BrandModel,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository  ,
    BrandRepository, 
    S3Service,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
