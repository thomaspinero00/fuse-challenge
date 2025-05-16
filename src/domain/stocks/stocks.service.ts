import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { vendorApiClient } from 'src/common/utils/vendorApiClient';
import { Portfolio } from 'src/services/data-services/entities/portfolio.entity';
import mongoose, { Model } from 'mongoose';
import { Transaction, TRANSACTION_STATUSES } from 'src/services/data-services/entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import * as dto from './dtos';
@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioRepository: Model<Portfolio>,
    @InjectModel(Transaction.name) private transactionRepository: Model<Transaction>,
    private readonly configService: ConfigService,
  ) {}

  async getAllStocks(nextToken?: string): Promise<any> {
    const response = await vendorApiClient.get('/stocks', {
      params: { nextToken },
    });

    return response.data;
  }

  async buyStock(body: dto.StocksBuyDTO): Promise<void> {
    const { symbol, quantity, purchasePrice } = body;

    const defaultUserId = this.configService.get('DEFAULT_USER_ID');

    const portfolio = await this.portfolioRepository.findOne({ user: new mongoose.Types.ObjectId(defaultUserId) });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    const currentPrice = await this.getCurrentStockPrice(symbol);
    const priceDifference = Math.abs(currentPrice - purchasePrice);
    if (priceDifference / currentPrice > 0.02) {
      // Guardar transacción fallida
      await this.saveTransaction(
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
    await this.saveTransaction(symbol, quantity, purchasePrice, TRANSACTION_STATUSES.SUCCESSFUL);
  }
  private async saveTransaction(
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
      user: new mongoose.Types.ObjectId('6826ca2b268c5909b0a4e4b2'), // Asegúrate de usar el ID del usuario correcto aquí
    });
    await transaction.save();
  }

  //--------------------------------------------   PRIVATE METHODS   --------------------------------------------
  private async getCurrentStockPrice(symbol: string): Promise<number> {
    const {
      data: {
        data: { items },
      },
    } = await vendorApiClient.get('/stocks', {
      params: {},
    });
    console.log(items);

    const item = items.find(
      (stock: { lastUpdated: string; change: number; price: number; name: string; sector: string; symbol: string }) =>
        stock.symbol === symbol,
    );

    console.log(item);

    return item ? item.price : 0;

    // return response.data.price; // Ajusta según la estructura de respuesta
  }
}
