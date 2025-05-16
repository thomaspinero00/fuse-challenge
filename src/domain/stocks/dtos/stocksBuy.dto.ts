import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StocksBuyDTO {
  @ApiProperty({
    description: 'Symbol of the stock',
    example: 'XOM',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Quantity of stocks to buy',
    example: 10,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Price of transcation',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;
}
