import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from '../../application/transactions.service';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';
import { TransactionResponseDto } from '../../application/dto/transaction-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create and process a new payment transaction' })
  @ApiResponse({ status: 201, type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or payment failed' })
  async create(
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.transactionsService.create(dto);
    if (result.isFailure) {
      throw new BadRequestException(result.getError());
    }
    return result.getValue();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by ID (for polling status)' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findById(@Param('id') id: string): Promise<TransactionResponseDto> {
    const result = await this.transactionsService.findById(id);
    if (result.isFailure) {
      throw new NotFoundException(result.getError());
    }
    return result.getValue();
  }

  @Get('reference/:reference')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by Wompi reference' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  async findByReference(
    @Param('reference') reference: string,
  ): Promise<TransactionResponseDto> {
    const result = await this.transactionsService.findByReference(reference);
    if (result.isFailure) {
      throw new NotFoundException(result.getError());
    }
    return result.getValue();
  }
}
