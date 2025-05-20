// stock-cache.cron.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StockCacheService } from 'src/services/cache-services/stock-cache.service';

import { VendorApiService } from 'src/services/vendor-services/vendor-api.service';
import { StockType } from './types/stocks.types';

@Injectable()
export class StockCacheCronService {
  private readonly logger = new Logger(StockCacheCronService.name);

  constructor(
    private readonly stockCacheService: StockCacheService,
    private readonly vendorService: VendorApiService,
  ) {}

  @Cron('*/5 * * * *') // each 5m
  async updateStockCache() {
    try {
      this.logger.log('Running updateStockCache Cronjob');
      const currentStocks = await this.getStocksRecursively();
      this.logger.log('current stocks', currentStocks.length);
      const cachedStocks = await this.stockCacheService.getStocks();

      if (!cachedStocks || this.hasStockPricesChanged(currentStocks, cachedStocks)) {

        await this.stockCacheService.setStocks(currentStocks);
        this.logger.log('Stock cache updated with new prices');
      } else {
        await this.stockCacheService.refreshTTL();
        this.logger.log('Stock cache TTL renewed');
      }
    } catch (error) {
      this.logger.error('Error updating stock cache:', error);
    }
  }

  private hasStockPricesChanged(newStocks: StockType[], cachedStocks: StockType[]): boolean {
    return newStocks.some((newStock) => {
      const cachedStock = cachedStocks.find((c) => c.symbol === newStock.symbol);
      return !cachedStock || cachedStock.price !== newStock.price;
    });
  }

  private async getStocksRecursively(): Promise<StockType[]> {
    const allStocks = [];
    let nextToken = null;
    do {
      try {
        const vendorApiClient = await this.vendorService.getClient();

        const response: {
          data: {
            data: {
              items: StockType[];
              nextToken: string | null;
            };
          };
        } = await vendorApiClient.get('/stocks', { params: { nextToken } });

        const items = response.data.data.items;
        allStocks.push(...items);
        nextToken = response.data.data.nextToken;
      } catch (error) {
        this.logger.error('Error fetching stocks:', error);
        throw new InternalServerErrorException('Error fetching stocks');
      }
    } while (nextToken);
    return allStocks;
  }
}
