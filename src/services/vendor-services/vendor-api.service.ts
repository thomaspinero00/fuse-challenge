import { Injectable } from '@nestjs/common';
import { VendorApiClient } from './vendor-api.client';

@Injectable()
export class VendorApiService {
  constructor(private vendorApiClient: VendorApiClient) {}

  async getClient() {
    const client = this.vendorApiClient.getClient();

    return client;
  }
}
