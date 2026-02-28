import { Injectable, NotFoundException } from '@nestjs/common';
import { ITransactionsRepository } from '../domain/repositories/transactions.repository';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { Result } from '../../../common/result/result';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: ITransactionsRepository,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async create(
    dto: CreateTransactionDto,
  ): Promise<Result<TransactionResponseDto>> {
    return this.createTransactionUseCase.execute(dto);
  }

  async findById(id: string): Promise<Result<TransactionResponseDto>> {
    const transaction = await this.transactionsRepo.findById(id);
    if (!transaction) {
      return Result.fail(`Transaction "${id}" not found`);
    }
    return Result.ok(TransactionResponseDto.fromEntity(transaction));
  }

  async findByReference(
    reference: string,
  ): Promise<Result<TransactionResponseDto>> {
    const transaction =
      await this.transactionsRepo.findByReference(reference);
    if (!transaction) {
      return Result.fail(`Transaction with reference "${reference}" not found`);
    }
    return Result.ok(TransactionResponseDto.fromEntity(transaction));
  }
}
