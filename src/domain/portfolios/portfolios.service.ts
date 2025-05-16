import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Portfolio } from 'src/services/data-services/entities/portfolio.entity';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioRepository: Model<Portfolio>,

    private readonly configService: ConfigService,
  ) {}

  async getPortfolio(): Promise<Portfolio> {
    try {
      const defaultUserId = this.configService.get('DEFAULT_USER_ID');

      const portfolio = await this.portfolioRepository.findOne({ user: new mongoose.Types.ObjectId(defaultUserId) });

      if (!portfolio) {
        throw new NotFoundException(`Portfolio not found.`);
      }

      return portfolio;
    } catch (error) {
      throw new InternalServerErrorException( `Error getting portfolio: ${error}`);
    }
  }
}
