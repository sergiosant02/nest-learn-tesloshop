import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  slug?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  sizes: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  @ApiProperty()
  gender: string;

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  @IsOptional()
  images?: string[];
}
