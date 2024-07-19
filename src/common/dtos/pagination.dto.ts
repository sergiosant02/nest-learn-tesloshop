import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto<t> {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ nullable: true })
  total?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  offset?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  limit?: number;

  @IsOptional()
  @ApiProperty()
  data?: t;
}
