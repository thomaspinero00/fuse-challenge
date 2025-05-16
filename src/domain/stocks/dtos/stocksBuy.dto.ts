import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StocksBuyDTO {
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;
}
