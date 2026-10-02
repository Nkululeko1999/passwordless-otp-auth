import { Injectable } from '@nestjs/common';
import { NodemailerProvider } from './products/nodemailer.provider.js';
import { SendEmailOptions } from './email.types.js';

@Injectable()
export class EmailService {
  constructor(
    private readonly nodemailerProvider: NodemailerProvider,
  ) {}

  async send(options: SendEmailOptions) {
    return this.nodemailerProvider.sendMail(options);
  }
}