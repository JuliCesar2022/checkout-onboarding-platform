import { Injectable } from '@nestjs/common';
import { IDeliveriesRepository } from '../domain/repositories/deliveries.repository';
import { DeliveryResponseDto } from './dto/delivery-response.dto';
import { Result } from '../../../common/result/result';

@Injectable()
export class DeliveriesService {
  constructor(private readonly deliveriesRepo: IDeliveriesRepository) {}

  async findByTransactionId(
    transactionId: string,
  ): Promise<Result<DeliveryResponseDto>> {
    const delivery =
      await this.deliveriesRepo.findByTransactionId(transactionId);
    if (!delivery) {
      return Result.fail(`No delivery found for transaction "${transactionId}"`);
    }
    return Result.ok(DeliveryResponseDto.fromEntity(delivery));
  }
}
