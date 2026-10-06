import { Controller, Post, Get, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  seedAll() {
    return this.seedService.seedAll();
  }

  @Get('status')
  getStatus() {
    return this.seedService.getStatus();
  }

  @Delete()
  clearAll() {
    return this.seedService.clearAll();
  }
}
