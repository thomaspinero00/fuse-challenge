import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './entities/portfolio.entity';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_READ_WRITE_URI');
        
        return {
          uri,
          serverSelectionTimeoutMS: 60000,
          socketTimeoutMS: 60000,
          connectTimeoutMS: 60000,
          heartbeatFrequencyMS: 30000,
          authSource: 'admin',
          family: 4,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
