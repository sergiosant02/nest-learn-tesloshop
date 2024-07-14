import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-images.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let product;
    const { images = [], ...productDetails } = createProductDto;
    try {
      product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      product = await this.productRepository.save(product);
    } catch (error) {
      this.handleExecption(error);
    }
    return { ...product, images: images };
  }

  async findAll(pagination: PaginationDto<any>) {
    console.log(pagination);
    const { offset = 1, limit = 10 } = pagination;
    return await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: {
        images: true,
      },
    });
  }

  async findOne(term: string) {
    let product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('slug =:slug or UPPER(title) =:title ', {
          slug: term.toLowerCase(),
          title: term.toUpperCase(),
        })
        .leftJoinAndSelect('prod.images', 'imageAliaas')
        .getOne();
    }
    if (!product) {
      throw new BadRequestException(`Product with term ${term} not found`);
    }
    return { ...product, images: product.images.map((image) => image.url) };
  }

  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('prod');
    await query.delete().where({}).execute();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images = [], ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images.length > 0) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      if (!product) {
        throw new BadRequestException(`Product with id ${id} not found`);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExecption(error);
    }
    return this.findOne(id);
  }

  async remove(term: string) {
    const product = await this.findOne(term);
    if (!product) {
      throw new BadRequestException(`Product with term ${term} not found`);
    }
    await this.productRepository.delete(product.id);
  }

  private handleExecption(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error.message, error.stack);
    throw new InternalServerErrorException(
      'Unexpected server error, check server logs',
    );
  }
}
