import { ApiProperty } from '@nestjs/swagger';
import type {
  TransactionEntity,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() reference: string;
  @ApiProperty({ nullable: true }) gatewayId: string | null;
  @ApiProperty() status: TransactionStatus;
  @ApiProperty() totalAmountInCents: number;
  @ApiProperty() currency: string;
  @ApiProperty({ nullable: true }) cardBrand: string | null;
  @ApiProperty({ nullable: true }) cardLastFour: string | null;
  /** Concepts like SUBTOTAL, SHIPPING, etc. */
  @ApiProperty() breakdown: { concept: string; amountInCents: number }[];
  @ApiProperty() customerId: string;
  @ApiProperty() createdAt: Date;

  static fromEntity(entity: TransactionEntity): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = entity.id;
    dto.reference = entity.reference;
    dto.gatewayId = entity.payment?.gatewayId ?? null;
    dto.status = entity.status;
    dto.totalAmountInCents = entity.totalAmountInCents;
    dto.currency = entity.currency;
    dto.cardBrand = entity.payment?.cardBrand ?? null;
    dto.cardLastFour = entity.payment?.cardLastFour ?? null;
    dto.breakdown =
      entity.breakdown?.map((b) => ({
        concept: b.concept,
        amountInCents: b.amountInCents,
      })) ?? [];
    dto.customerId = entity.customerId;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
