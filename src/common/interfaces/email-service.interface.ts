export abstract class IEmailServices {
  abstract sendEmail(options: {
    to: string;
    subject: string;
    body: any;
    template?: string;
    language?: string;
  }): Promise<any>;
}
