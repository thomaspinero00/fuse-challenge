import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockCacheService } from './stock-cache.service';

@Module({
  imports: [ConfigModule],
  providers: [StockCacheService],
  exports: [StockCacheService],
})
export class StockCacheModule {}
