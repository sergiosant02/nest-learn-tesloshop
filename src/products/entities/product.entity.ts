import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-images.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { unique: true })
  @Index('slug_index')
  slug: string;

  @Column('numeric', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @BeforeInsert()
  @BeforeUpdate()
  presaved() {
    this.generateSlug();
  }

  private generateSlug(): void {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .replace(/\s+/g, '-')
      .replaceAll("'", '')
      .toLowerCase();
  }
}
