import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from '../../application/customers.service';
import { CustomerResponseDto } from '../../application/dto/customer-response.dto';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('customers')
@Controller('customers')
@PublicEndpoint()  // Read-only: 100 req/min per IP
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    return unwrap(await this.customersService.findById(id), 'not_found');
  }
}
