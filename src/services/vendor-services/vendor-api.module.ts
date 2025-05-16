import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VendorApiService } from './vendor-api.service';
import { VendorApiClient } from './vendor-api.client';

@Module({
  imports: [ConfigModule],
  providers: [VendorApiService, VendorApiClient],
  exports: [VendorApiService],
})
export class VendorApiModule {}
