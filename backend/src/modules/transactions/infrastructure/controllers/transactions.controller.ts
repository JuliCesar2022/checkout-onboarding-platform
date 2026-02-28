import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from '../../application/transactions.service';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';
import { TransactionResponseDto } from '../../application/dto/transaction-response.dto';
import { StrictEndpoint, PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @StrictEndpoint()  // Sensitive: 10 req/min per IP
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create and process a new payment transaction' })
  @ApiResponse({ status: 201, type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or payment failed' })
  async create(@Body() dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return unwrap(await this.transactionsService.create(dto));
  }

  @Get(':id')
  @PublicEndpoint()  // Read-only: 100 req/min per IP
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by ID (for polling status)' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findById(@Param('id') id: string): Promise<TransactionResponseDto> {
    return unwrap(await this.transactionsService.findById(id), 'not_found');
  }

  @Get('reference/:reference')
  @PublicEndpoint()  // Read-only: 100 req/min per IP
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by Wompi reference' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findByReference(@Param('reference') reference: string): Promise<TransactionResponseDto> {
    return unwrap(await this.transactionsService.findByReference(reference), 'not_found');
  }
}
