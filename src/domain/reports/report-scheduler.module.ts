import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { ReportSchedulerService } from './report-scheduler.service';
import { DatabaseModule } from 'src/services/data-services/database.module';
import { EmailServicesModule } from 'src/services/email-services/email-services.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, EmailServicesModule],
  providers: [ReportSchedulerService],
})
export class SchedulerModule {}
