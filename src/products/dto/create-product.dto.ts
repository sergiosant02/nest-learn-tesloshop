import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  description?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
