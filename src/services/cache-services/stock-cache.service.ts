import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

interface StockType {
  lastUpdated: string;
  change: number;
  price: number;
  name: string;
  sector: string;
  symbol: string;
}

@Injectable()
export class StockCacheService {
  private readonly logger = new Logger(StockCacheService.name);
  private readonly redis: Redis;
  private readonly TTL = 360; // 6 minutes (accepts seconds)

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST') || 'localhost',
      port: this.configService.get('REDIS_PORT') || 6379,
    });

    this.redis.on('connect', () => {
      this.logger.log(`Sucessfully connected to Redis :D`);
    });
    this.redis.on('error', (err) => {
      this.logger.log(`Redis Error: ${err}`);
    });
  }

  async getStocks(): Promise<StockType[] | null> {
    const cachedStocks = await this.redis.get('stocks').catch((err) => {
      this.logger.log(`Redis Error: ${err}`);
      return null;
    });
    return cachedStocks ? JSON.parse(cachedStocks) : null;
  }

  async setStocks(stocks: StockType[]): Promise<void> {
    await this.redis.set('stocks', JSON.stringify(stocks), 'EX', this.TTL).catch((err) => {
      this.logger.log(`Redis Error: ${err}`);
      return null;
    });
  }

  async refreshTTL(): Promise<void> {
    await this.redis.expire('stocks', this.TTL).catch((err) => {
      this.logger.log(`Redis Error: ${err}`);
      return null;
    });
  }
}
