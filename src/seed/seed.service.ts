import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data-seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    await this.insertProducts();
    return 'This action adds a new seed';
  }

  private async insertProducts() {
    await this.productsService.deleteAll();
    const products = await Promise.all(
      initialData.products.map((product) => {
        const { title, sizes, gender, tags, ...productData } = product;
        return this.productsService.create({
          title,
          sizes,
          gender,
          tags,
          ...productData,
        });
      }),
    );
    return products;
  }
}
