/**
 * HEXAGONAL ARCHITECTURE: NOTIFICATION PORT
 *
 * This is the OUTPUT port (driven adapter pattern).
 * The application uses this port to send notifications.
 * The concrete implementation (EmailAdapter, SMSAdapter, etc.) lives in infrastructure.
 *
 * Benefits:
 * - Swap email for SMS without touching domain/application code
 * - Easy to mock for testing
 * - Decoupled from external service details (SendGrid, Twilio, etc.)
 */

export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  variables?: Record<string, unknown>;
}

export interface SendEmailOutput {
  messageId: string;
  sentAt: Date;
  status: 'sent' | 'queued' | 'failed';
}

export abstract class INotificationPort {
  /**
   * Send email notification
   * Implementations: SendGridAdapter, MockEmailAdapter, etc.
   */
  abstract sendEmail(input: SendEmailInput): Promise<SendEmailOutput>;

  /**
   * Send SMS notification (optional)
   */
  abstract sendSMS?(
    to: string,
    message: string,
  ): Promise<{ messageId: string; status: 'sent' | 'failed' }>;
}
