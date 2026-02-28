import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from '../../application/customers.service';
import { CustomerResponseDto } from '../../application/dto/customer-response.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    const result = await this.customersService.findById(id);
    if (result.isFailure) {
      throw new NotFoundException(result.getError());
    }
    return result.getValue();
  }
}
