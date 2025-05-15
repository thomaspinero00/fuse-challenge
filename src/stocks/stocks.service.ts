import { Injectable } from '@nestjs/common';
import { vendorApiClient } from '../utils/vendorApiClient';


@Injectable()
export class StocksService {
  async getAllStocks(nextToken?: string): Promise<any> {
    const response = await vendorApiClient.get('/stocks', {
      params: { nextToken },
    });
    return response.data;
  }
}