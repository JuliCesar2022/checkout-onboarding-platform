import { Injectable, Logger } from '@nestjs/common';
import {
  INotificationPort,
  SendEmailInput,
  SendEmailOutput,
} from '../../domain/ports/notification.port';

/**
 * HEXAGONAL ARCHITECTURE: EMAIL ADAPTER
 *
 * This is the concrete implementation of INotificationPort.
 * It adapts external email service to the domain's notification concept.
 *
 * Currently: Mock implementation (console.log)
 * To use real SendGrid: uncomment and configure
 */

@Injectable()
export class EmailNotificationAdapter implements INotificationPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);

  /**
   * Mock implementation — in production use SendGrid / Mailgun / AWS SES
   */
  async sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
    // Production: call SendGrid API
    // const response = await sgMail.send({
    //   to: input.to,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: input.subject,
    //   text: input.body,
    //   templateId: input.templateId,
    //   dynamicTemplateData: input.variables,
    // });

    this.logger.log(`[EMAIL] To: ${input.to}, Subject: ${input.subject}`);
    this.logger.debug(`Body: ${input.body}`);

    return {
      messageId: `mock-${Date.now()}`,
      sentAt: new Date(),
      status: 'sent',
    };
  }

  /**
   * Optional SMS implementation
   */
  async sendSMS?(to: string, message: string) {
    this.logger.log(`[SMS] To: ${to}, Message: ${message}`);
    return {
      messageId: `mock-sms-${Date.now()}`,
      status: 'sent' as const,
    };
  }
}
