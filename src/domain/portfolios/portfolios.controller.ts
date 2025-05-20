import { Controller, Get, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolios.service';
import { ApiTokenGuard } from 'src/common/guards/api-token.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('my-portfolio')
  @UseGuards(ApiTokenGuard)
  async getPortfolio() {
    try {
      const portfolio = await this.portfolioService.getPortfolio();
      return portfolio;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error fetching portfolio: ' + error.message);
    }
  }
}
