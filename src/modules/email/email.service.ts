import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data) {
    const { email, nombre, token } = data;

    const subject = `Welcome to Company: ${nombre}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      context: {
        nombre: nombre,
        confirmation_url: 'http://localhost:3000/confirm?token=' + token,
      },
    });
  }

  async resendVerification(data) {
    const { email, nombre, token } = data;

    const subject = `Resend Verification`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './resend-verification',
      context: {
        nombre: nombre,
        confirmation_url: 'http://localhost:3000/confirm?token=' + token,
      },
    });
  }
}
