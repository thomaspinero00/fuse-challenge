// portfolio/portfolio.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PortfolioService } from './portfolios.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId')
  async getPortfolio(@Param('userId') userId: string) {
    const portfolio = await this.portfolioService.getPortfolio(userId);

    return portfolio;
  }
}
