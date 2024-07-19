import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('sedds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  execute() {
    return this.seedService.execute();
  }
}
