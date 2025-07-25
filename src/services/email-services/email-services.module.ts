import { Module } from '@nestjs/common';
import { SESModule } from './ses/ses.module';

@Module({
  imports: [SESModule],
  exports: [SESModule],
})
export class EmailServicesModule {}
