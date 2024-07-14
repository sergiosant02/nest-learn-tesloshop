import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false, unique: true })
  url: string;

  @ManyToOne(() => Product, (product: Product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
