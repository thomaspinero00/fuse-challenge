import { SendEmailCommand, SendEmailRequest, SESClient } from '@aws-sdk/client-ses';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { IEmailServices } from 'src/common/interfaces/email-service.interface';
import React from 'react';
import { getEmailComponent } from 'src/common/utils/email-template';

@Injectable()
export class SESService implements IEmailServices {
  private sesClient: SESClient;
  private senderEmail: string;

  constructor(private readonly configService: ConfigService) {
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY');
    const region = this.configService.get('AWS_REGION');

    this.sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.senderEmail = this.configService.get('AWS_SES_SENDER_EMAIL') || '';
  }

  public async sendEmail({ to, subject, body }: any): Promise<string> {
    let emailComponent: React.ReactElement;

    try {
      emailComponent = getEmailComponent(body);
    } catch (error: any) {
      Logger.error(`Error al obtener el componente de email: ${error.message}`, 'EMAIL SERVICE');
      throw new HttpException('Template de email no soportado', HttpStatus.BAD_REQUEST);
    }

    // Renderize HTML
    let html: string;
    try {
      html = await render(emailComponent);
    } catch (error: any) {
      Logger.error(`Error al renderizar el email: ${error.message}`, 'EMAIL SERVICE');
      throw new HttpException('Error al procesar el email', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const params: SendEmailRequest = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.senderEmail,
    };

    const command = new SendEmailCommand(params);

    try {
      await this.sesClient.send(command);
      return 'Email sent successfully';
    } catch (error) {
      Logger.error(`${error.message}`, 'EMAIL SERVICE');
      throw new HttpException('Email service failed', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
