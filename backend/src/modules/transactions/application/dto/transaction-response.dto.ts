import { ApiProperty } from '@nestjs/swagger';
import type { TransactionEntity, TransactionStatus } from '../../domain/entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() reference: string;
  @ApiProperty({ nullable: true }) wompiId: string | null;
  @ApiProperty() status: TransactionStatus;
  @ApiProperty() amountInCents: number;
  @ApiProperty() currency: string;
  @ApiProperty({ nullable: true }) cardBrand: string | null;
  @ApiProperty({ nullable: true }) cardLastFour: string | null;
  @ApiProperty() productAmountInCents: number;
  @ApiProperty() baseFeeInCents: number;
  @ApiProperty() deliveryFeeInCents: number;
  @ApiProperty() productId: string;
  @ApiProperty() quantity: number;
  @ApiProperty() customerId: string;
  @ApiProperty() createdAt: Date;

  static fromEntity(entity: TransactionEntity): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = entity.id;
    dto.reference = entity.reference;
    dto.wompiId = entity.wompiId;
    dto.status = entity.status;
    dto.amountInCents = entity.amountInCents;
    dto.currency = entity.currency;
    dto.cardBrand = entity.cardBrand;
    dto.cardLastFour = entity.cardLastFour;
    dto.productAmountInCents = entity.productAmountInCents;
    dto.baseFeeInCents = entity.baseFeeInCents;
    dto.deliveryFeeInCents = entity.deliveryFeeInCents;
    dto.productId = entity.productId;
    dto.quantity = entity.quantity;
    dto.customerId = entity.customerId;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
