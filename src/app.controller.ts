import { Controller } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  getHealth() {
    return { status: 'API is running', timestamp: new Date().toISOString() };
  }
}
