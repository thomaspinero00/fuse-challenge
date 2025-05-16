export abstract class IEmailServices {
  abstract sendEmail(options: { to: string; subject: string; body: any }): Promise<string>;
}
