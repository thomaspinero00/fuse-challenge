import { DynamicModule, Module, NestModule } from '@nestjs/common';
import { StocksModule } from './domain/stocks/stocks.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PortfolioModule } from './domain/portfolios/portfolios.module';
import { DatabaseModule } from './services/data-services/database.module';
import { SchedulerModule } from './domain/reports/report-scheduler.module';
import { EmailServicesModule } from './services/email-services/email-services.module';
import { VendorApiModule } from './services/vendor-services/vendor-api.module';

@Module({})
export class AppModule implements NestModule {
  static forRoot(environments: object): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => environments],
          cache: true,
        }),
        DatabaseModule,
        EmailServicesModule,
        VendorApiModule,
        StocksModule,
        PortfolioModule,
        SchedulerModule,
      ],
      controllers: [AppController],
      providers: [],
    };
  }
  configure(): void {}
}
