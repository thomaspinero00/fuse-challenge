import { Module } from '@nestjs/common';
import { StocksModule } from './stocks/stocks.module';

// import { PortfoliosModule } from './portfolios/portfolios.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [
    StocksModule,
    // PortfoliosModule,
    // TransactionsModule,
    // ReportsModule,
  ],
})
export class AppModule {}