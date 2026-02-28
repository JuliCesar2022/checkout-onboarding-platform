import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeliveriesService } from '../../application/deliveries.service';
import { DeliveryResponseDto } from '../../application/dto/delivery-response.dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get('transaction/:transactionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get delivery info for a transaction' })
  @ApiResponse({ status: 200, type: DeliveryResponseDto })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async findByTransactionId(
    @Param('transactionId') transactionId: string,
  ): Promise<DeliveryResponseDto> {
    const result =
      await this.deliveriesService.findByTransactionId(transactionId);
    if (result.isFailure) {
      throw new NotFoundException(result.getError());
    }
    return result.getValue();
  }
}
