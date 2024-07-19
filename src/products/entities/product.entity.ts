import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { unique: true })
  title: string;

  @ApiProperty()
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty()
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty()
  @Column('text', { unique: true })
  @Index('slug_index')
  slug: string;

  @ApiProperty()
  @Column('numeric', { default: 0 })
  stock: number;

  @ApiProperty()
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty()
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
