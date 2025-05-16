import { Body, Controller, Get, Post, Query, InternalServerErrorException, Logger } from '@nestjs/common';
import { StocksService } from './stocks.service';
import * as dto from './dtos';

@Controller('stocks')
export class StocksController {
  private readonly logger = new Logger(StocksController.name);

  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks() {
    try {
      return await this.stocksService.getStocks();
    } catch (error) {
      this.logger.error('Error fetching stocks:', error);
      throw new InternalServerErrorException('Error fetching stocks');
    }
  }

  @Post('buy-for-myself')
  async buyStock(@Body() body: dto.StocksBuyDTO) {
    try {
      await this.stocksService.buyStock(body);
      return {};
    } catch (error) {
      this.logger.error('Error buying stock:', error);
      throw new InternalServerErrorException('Error buying stock');
    }
  }
}
