import { Inject, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/services/data-services/entities/user.entity';
import { Transaction } from 'src/services/data-services/entities/transaction.entity';
import { Model } from 'mongoose';
import { IEmailServices } from 'src/common/interfaces/email-service.interface';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name); // Logger para este servicio

  constructor(
    @InjectModel(User.name) private userRepository: Model<User>,
    @InjectModel(Transaction.name) private transactionRepository: Model<Transaction>,
    @Inject(IEmailServices) private emailService: IEmailServices,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Executing cron job');

    let emailsQueue: { user: User; transactions: Transaction[] }[] = [];

    try {
      const users = await this.userRepository.find();
      this.logger.log(`Found ${users.length} users`);

      for (const user of users) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const transactions = await this.transactionRepository.find({
          user: user._id,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        emailsQueue.push({ user, transactions });

        const emailBody = { user, transactions };

        try {
          await this.emailService.sendEmail({
            to: user.email,
            subject: 'Fuse Challenge - Daily transactions Report',
            body: emailBody,
          });
          this.logger.log(`Email sent to: ${user.email}`);
        } catch (error) {
          this.logger.error(`Error while sending the report email to: ${user.email}`, error);
        }
      }
    } catch (error) {
      this.logger.error('Error in handleCron:', error);
      throw new InternalServerErrorException('Error executing cron job');
    }
  }
}
