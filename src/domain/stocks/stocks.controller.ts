import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import * as dto from './dtos';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query('nextToken') nextToken?: string) {
    return this.stocksService.getAllStocks(nextToken);
  }

  @Post('buy-for-myself')
  async buyStock(@Body() body: dto.StocksBuyDTO) {
    await this.stocksService.buyStock(body);

    return { status: 'OK' };
  }
}
