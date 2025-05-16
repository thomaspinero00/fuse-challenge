import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class VendorApiClient {
  private vendorApiKey: string;
  private vendorBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.vendorApiKey = this.configService.get<string>('VENDOR_API_KEY') || '';
    this.vendorBaseUrl = this.configService.get<string>('VENDOR_URI') || '';
  }

  public getClient() {
    return axios.create({
      baseURL: this.vendorBaseUrl,
      headers: {
        'x-api-key': this.vendorApiKey,
      },
    });
  }
}
