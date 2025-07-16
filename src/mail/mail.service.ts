import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendLoginMail(to: string, username: string) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'login.ejs',
    );
    const html = await ejs.renderFile(templatePath, { username });

    await this.transporter.sendMail({
      from: `"Crm App" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject: 'Login Notification',
      html,
    });
  }
  async sendResetPasswordMail(to: string, code: string) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'reset-password.ejs',
    );
    const html = await ejs.renderFile(templatePath, { code });
    await this.transporter.sendMail({
      from: `"notreply@me.com" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject: 'Password Reset Code',
      html,
    });
  }

  async sendTaskMail(
    to: string,
    task: { title: string; status: string; dueDate: Date },
  ) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'task.ejs',
    );
    const html = await ejs.renderFile(templatePath, {
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
    });

    await this.transporter.sendMail({
      from: `"Crm App" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject: 'New Task Assigned',
      html,
    });
  }

  async sendDealMail(
    to: string,
    deal: { title: string; amount: string; status: string; customerId: string },
  ) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'deal.ejs',
    );
    const html = await ejs.renderFile(templatePath, {
      title: deal.title,
      amount: deal.amount,
      status: deal.status,
      customerId: deal.customerId,
    });

    await this.transporter.sendMail({
      from: `"Crm App" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject: 'New Deal Notification',
      html,
    });
  }
}
