import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { DatabaseModule } from 'src/services/data-services/database.module';
import { ConfigModule } from '@nestjs/config';
import { VendorApiModule } from 'src/services/vendor-services/vendor-api.module';
import { StockCacheModule } from 'src/services/cache-services/stock-cache.module';
import { StockCacheCronService } from './stocks-cache-cron.service';

@Module({
  imports: [DatabaseModule, ConfigModule, VendorApiModule, StockCacheModule],
  controllers: [StocksController],
  providers: [StocksService, StockCacheCronService],
})
export class StocksModule {}
