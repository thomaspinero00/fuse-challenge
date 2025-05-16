import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/services/data-services/entities/user.entity';
import { Transaction } from 'src/services/data-services/entities/transaction.entity';
import { Model } from 'mongoose';
import { IEmailServices } from 'src/common/interfaces/email-service.interface';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<User>,
    @InjectModel(Transaction.name) private transactionRepository: Model<Transaction>,
    @Inject(IEmailServices) private emailService: IEmailServices,
  ) {}

  @Cron('20 10 * * *') // Every minute
  async handleCron() {
    console.log('executing cron');

    const users = await this.userRepository.find();

    let emailsQueue: { user: User; transactions: Transaction[] }[] = [];

    for (const user of users) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const transactions = await this.transactionRepository.find({
        user: user._id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      if (transactions.length > 0) {
        emailsQueue.push({ user, transactions });
      }

      console.log('Cola de emails:', emailsQueue); // Enviar correos electrónicos
      await Promise.all(
        emailsQueue.map(async ({ user, transactions }) => {
          const emailBody = {
            user,
            transactions,
          };
          try {
            await this.emailService.sendEmail({
              to: user.email,
              subject: 'Daily transactions Report',
              body: emailBody,
            });
            console.log(`Email Sent to: ${user.email}`);
          } catch (error) {
            console.error(`Error while sending the report email to: ${user.email} - `, error);
          }
        }),
      );
    }
  }
}
