import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/services/data-services/database.module';
import { PortfolioService } from './portfolios.service';
import { PortfolioController } from './portfolios.controller';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
