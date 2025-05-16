import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { DatabaseModule } from 'src/services/data-services/database.module';
import { ConfigModule } from '@nestjs/config';
import { VendorApiModule } from 'src/services/vendor-services/vendor-api.module';

@Module({
  imports: [DatabaseModule, ConfigModule, VendorApiModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
