import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/health')
  getHealth() {
    return { status: 'API is running', timestamp: new Date().toISOString() };
  }
}
