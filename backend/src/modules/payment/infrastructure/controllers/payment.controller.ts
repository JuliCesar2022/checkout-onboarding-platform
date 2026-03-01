import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IPaymentPort } from '../../domain/ports/payment.port';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('checkout')
@Controller('checkout')
export class PaymentController {
  constructor(private readonly paymentPort: IPaymentPort) {}

  @Get('acceptance-token')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Wompi acceptance tokens (T&C + personal data auth)',
  })
  async getAcceptanceToken() {
    return unwrap(await this.paymentPort.getAcceptanceToken());
  }
}
