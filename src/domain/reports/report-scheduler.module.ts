import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './send-daily-report.service';
import { DatabaseModule } from 'src/services/data-services/database.module';
import { EmailServicesModule } from 'src/services/email-services/email-services.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, EmailServicesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
