import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeliveriesService } from '../../application/deliveries.service';
import { DeliveryResponseDto } from '../../application/dto/delivery-response.dto';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('deliveries')
@Controller('deliveries')
@PublicEndpoint()  // Read-only: 100 req/min per IP
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
    return unwrap(
      await this.deliveriesService.findByTransactionId(transactionId),
      'not_found',
    );
  }
}
