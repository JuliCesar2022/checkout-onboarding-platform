import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationAdapter } from './email-notification.adapter';
import { Logger } from '@nestjs/common';

describe('EmailNotificationAdapter', () => {
  let adapter: EmailNotificationAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailNotificationAdapter],
    }).compile();

    adapter = module.get<EmailNotificationAdapter>(EmailNotificationAdapter);
  });

  it('should log and return sent status for email', async () => {
    const input = {
      to: 'test@example.com',
      subject: 'Hello',
      body: 'World',
    };

    const result = await adapter.sendEmail(input);

    expect(result.status).toBe('sent');
    expect(result.messageId).toContain('mock-');
  });

  it('should log and return sent status for SMS', async () => {
    const result = await adapter.sendSMS!('123456', 'Hello');
    expect(result.status).toBe('sent');
  });
});
