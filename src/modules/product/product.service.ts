import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserDocument } from 'src/DB';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { BrandRepository } from 'src/DB/repository/brand.repository';
import { CategoryRepository } from 'src/DB/repository/category.repository';
import { S3Service } from 'src/common';
import { randomUUID } from 'node:crypto';
import { FolderEnum } from 'src/common/enums';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly s3Service: S3Service,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: UserDocument,
  ) {
    const { name, description, discountPrice, originalPrice, stock } =
      createProductDto;

    const category = await this.categoryRepository.findOne({
      filter: createProductDto.category._id,
    });
    if (!category) {
      throw new NotFoundException('Fail to find this category instance');
    }

    const brand = await this.brandRepository.findOne({
      filter: createProductDto.brands._id,
    });
    if (!brand) {
      throw new NotFoundException('Fail to find this brand instance');
    }

    const assetFolderId = randomUUID();
    const images = await this.s3Service.uploadFiles({
      files,
      path: `${FolderEnum.Category}/${createProductDto.category}/${FolderEnum.Product}/${assetFolderId}`,
    });

    const [product] = await this.productRepository.create({
      data: [
        {
          category: category._id,
          brands: brand._id,
          name,
          description,
          discountPrice,
          originalPrice,
          salePrice:
            originalPrice - originalPrice * ((discountPrice || 0) / 100),
          stock,
          assetFolderId,
          images,
          createdBy: user._id,
        },
      ],
    });
    if (!product) {
      await this.s3Service.deleteFiles({ urls: images });
      throw new BadRequestException('Fail to create this product instance');
    }

    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
