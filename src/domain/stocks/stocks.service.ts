import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from 'src/services/data-services/entities/portfolio.entity';
import mongoose, { Model } from 'mongoose';
import { Transaction, TRANSACTION_STATUSES } from 'src/services/data-services/entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import * as dto from './dtos';
import { VendorApiService } from 'src/services/vendor-services/vendor-api.service';
import { StockCacheService } from 'src/services/cache-services/stock-cache.service';
import { StockType } from './types/stocks.types';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  constructor(
    @InjectModel(Portfolio.name) private portfolioRepository: Model<Portfolio>,
    @InjectModel(Transaction.name) private transactionRepository: Model<Transaction>,

    private readonly configService: ConfigService,
    private readonly vendorService: VendorApiService,
    private readonly stockCacheService: StockCacheService,
  ) {}
  async getStocks(): Promise<StockType[]> {
    try {
      const cachedStocks = await this.stockCacheService.getStocks();
      if (cachedStocks) {
        return cachedStocks;
      }
      const allStocks = await this.getStocksAndSaveToCache();

      return allStocks;
    } catch (error) {
      this.logger.error('Error fetching stocks:', error);
      throw new InternalServerErrorException('Error fetching stocks');
    }
  }

  async buyStock(body: dto.StocksBuyDTO): Promise<void> {
    const { symbol, quantity, purchasePrice } = body;
    const defaultUserId = this.configService.get('DEFAULT_USER_ID');
    try {
      const vendorApiClient = await this.vendorService.getClient();

      const portfolio = await this.portfolioRepository.findOne({ user: new mongoose.Types.ObjectId(defaultUserId) });

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      let cachedStocks = await this.stockCacheService.getStocks();

      // in case the cache is empty
      if (!cachedStocks) {
        const stocks = await this.getStocksAndSaveToCache();
        cachedStocks = stocks;
      }

      const stockInfo = cachedStocks.find((stock: StockType) => stock.symbol === symbol);

      if (!stockInfo) {
        throw new NotFoundException(`Stock ${symbol} not found`);
      }

      const currentPrice = stockInfo.price;

      const priceDifference = Math.abs(currentPrice - purchasePrice);
      if (priceDifference / currentPrice > 0.02) {
        await this.saveTransaction(
          defaultUserId,
          symbol,
          quantity,
          purchasePrice,
          TRANSACTION_STATUSES.FAILED,
          'Invalid purchase price.',
        );
        throw new BadRequestException('Invalid purchase price.');
      }

      try {
        await vendorApiClient.post(`/stocks/${symbol}/buy`, { price: purchasePrice, quantity });
      } catch (vendorError) {
        await this.saveTransaction(
          defaultUserId,
          symbol,
          quantity,
          purchasePrice,
          TRANSACTION_STATUSES.FAILED,
          `Vendor API Error: ${vendorError.message}`,
        );
        throw new BadRequestException({ message: vendorError.message });
      }

      const existingStock = portfolio.stocks.find((stock: { symbol: string }) => stock.symbol === symbol);

      if (existingStock) {
        existingStock.quantity += quantity;
        existingStock.lastPurchasePrice = purchasePrice;
      } else {
        portfolio.stocks.push({ symbol, quantity, lastPurchasePrice: purchasePrice });
      }

      await portfolio.save();
      await this.saveTransaction(defaultUserId, symbol, quantity, purchasePrice, TRANSACTION_STATUSES.SUCCESSFUL);
      return;
    } catch (error) {
      await this.saveTransaction(
        defaultUserId,
        symbol,
        quantity,
        purchasePrice,
        TRANSACTION_STATUSES.FAILED,
        `System Error: ${error}`,
      );
      this.logger.error('Error in buyStock:', error);
      throw new InternalServerErrorException('Error processing stock purchase');
    }
  }

  //--------------------------------------------   PRIVATE METHODS   --------------------------------------------

  private async saveTransaction(
    userId: string,
    symbol: string,
    quantity: number,
    price: number,
    status: TRANSACTION_STATUSES,
    failureReason?: string,
  ): Promise<void> {
    const transaction = new this.transactionRepository({
      symbol,
      quantity,
      price,
      status,
      failureReason,
      user: new mongoose.Types.ObjectId(userId),
    });
    await transaction.save();
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

  private async getStocksAndSaveToCache(): Promise<StockType[]> {
    const allStocks = await this.getStocksRecursively();

    await this.stockCacheService.setStocks(allStocks);

    return allStocks;
  }
}
