import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  InternalServerErrorException,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import * as dto from './dtos';
import { ApiTokenGuard } from 'src/common/guards/api-token.guard';

@Controller('stocks')
export class StocksController {
  private readonly logger = new Logger(StocksController.name);

  constructor(private readonly stocksService: StocksService) {}

  @Get()
  @UseGuards(ApiTokenGuard)
  async getStocks() {
    try {
      return await this.stocksService.getStocks();
    } catch (error) {
      this.logger.error('Error fetching stocks:', error);
      throw new InternalServerErrorException('Error fetching stocks');
    }
  }

  @Post('buy-for-myself')
  @UseGuards(ApiTokenGuard)
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
