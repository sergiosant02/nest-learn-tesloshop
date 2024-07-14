import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto<t> {
  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsOptional()
  data?: t;
}
