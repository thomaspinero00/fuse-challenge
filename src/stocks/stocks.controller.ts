import { Controller, Get, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query('nextToken') nextToken?: string) {
    return this.stocksService.getAllStocks(nextToken);
  }
}