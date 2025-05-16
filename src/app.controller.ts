import { Controller } from '@nestjs/common';

// import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiTags('App')
@Controller('/')
export class AppController {
  constructor() {}

  //   @Get('/health')
  //   @ApiOperation({
  //     summary: 'Health check endpoint',
  //     description: 'Health check endpoint',
  //   })
  //   @ApiOkResponse({
  //     description: 'Health check endpoint',
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         status: {
  //           type: 'string',
  //           example: 'API is running',
  //         },
  //         timestamp: {
  //           type: 'string',
  //           example: '2023-11-13T12:08:26.950Z',
  //         },
  //       },
  //     },
  //   })
  getHealth() {
    return { status: 'API is running', timestamp: new Date().toISOString() };
  }
}
