import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SESService } from './ses.service';
import { IEmailServices } from 'src/common/interfaces/email-service.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    ConfigService,
    {
      provide: IEmailServices,
      useClass: SESService,
    },
  ],
  exports: [IEmailServices],
})
export class SESModule {}
