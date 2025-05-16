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

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  constructor(
    @InjectModel(Portfolio.name) private portfolioRepository: Model<Portfolio>,
    @InjectModel(Transaction.name) private transactionRepository: Model<Transaction>,

    private readonly configService: ConfigService,
    private readonly vendorService: VendorApiService,
  ) {}
  async getStocks(): Promise<any> {
    try {
      const vendorApiClient = await this.vendorService.getClient();
      const stocks = await this.getStocksRecursively(vendorApiClient);

      return stocks;
    } catch (error) {
      this.logger.error('Error fetching stocks from vendor API:', error);
      throw new InternalServerErrorException('Error fetching stocks from vendor API');
    }
  }

  async buyStock(body: dto.StocksBuyDTO): Promise<void> {
    const { symbol, quantity, purchasePrice } = body;

    const defaultUserId = this.configService.get('DEFAULT_USER_ID');
    try {
      const portfolio = await this.portfolioRepository.findOne({ user: new mongoose.Types.ObjectId(defaultUserId) });

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }
      const currentPrice = await this.getCurrentStockPrice(symbol);
      const priceDifference = Math.abs(currentPrice - purchasePrice);
      if (priceDifference / currentPrice > 0.02) {
        await this.saveTransaction(
          defaultUserId,
          symbol,
          quantity,
          purchasePrice,
          TRANSACTION_STATUSES.FAILED,
          'Purchase price is not within allowed range',
        );
        throw new BadRequestException('Purchase price is not within allowed range');
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
    } catch (error) {
      await this.saveTransaction(
        defaultUserId,
        symbol,
        quantity,
        purchasePrice,
        TRANSACTION_STATUSES.FAILED,
        'Purchase price is not within allowed range',
      );
      this.logger.error('Error in buyStock StocksService:', error);

      throw new InternalServerErrorException('Error processing stock purchase');
    }
  }

  //--------------------------------------------   PRIVATE METHODS   --------------------------------------------
  private async getCurrentStockPrice(symbol: string): Promise<number> {
    try {
      const vendorApiClient = await this.vendorService.getClient();

      const items = await this.getStocksRecursively(vendorApiClient);

      const item = items.find(
        (stock: { lastUpdated: string; change: number; price: number; name: string; sector: string; symbol: string }) =>
          stock.symbol === symbol,
      );

      return item ? item.price : 0;
    } catch (error) {
      this.logger.error('Error fetching current stock price:', error);
      throw new InternalServerErrorException('Error fetching current stock price');
    }
  }

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

  private async getStocksRecursively(vendorApiClient: any, nextToken?: string): Promise<any[]> {
    try {
      const response = await vendorApiClient.get('/stocks', { params: { nextToken } });
      const items = response.data.data.items;
      if (response.data.data.nextToken) {
        const nextStocks = await this.getStocksRecursively(vendorApiClient, response.data.data.nextToken);
        return [...items, ...nextStocks];
      }
      return items;
    } catch (error) {
      this.logger.error('Error fetching stocks recursively:', error);
      throw new InternalServerErrorException('Error fetching stocks recursively');
    }
  }
}
