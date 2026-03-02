import { Injectable } from '@nestjs/common';
import { ITransactionsRepository } from '../domain/repositories/transactions.repository';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { SyncTransactionStatusUseCase } from './use-cases/sync-transaction-status.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { Result } from '../../../common/result/result';
import { ErrorCode } from '../../../common/constants/error-codes.constants';
import { TRANSACTIONS_ERRORS } from '../domain/constants/transactions.constants';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: ITransactionsRepository,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly syncTransactionStatusUseCase: SyncTransactionStatusUseCase,
  ) {}

  async create(
    dto: CreateTransactionDto,
  ): Promise<Result<TransactionResponseDto>> {
    return this.createTransactionUseCase.execute(dto);
  }

  async findById(id: string): Promise<Result<TransactionResponseDto>> {
    const transaction = await this.transactionsRepo.findById(id);
    if (!transaction) {
      return Result.fail(TRANSACTIONS_ERRORS.NOT_FOUND(id));
    }
    return Result.ok(TransactionResponseDto.fromEntity(transaction));
  }

  async findByReference(
    reference: string,
  ): Promise<Result<TransactionResponseDto>> {
    const transaction = await this.transactionsRepo.findByReference(reference);
    if (!transaction) {
      return Result.fail(TRANSACTIONS_ERRORS.REFERENCE_NOT_FOUND(reference));
    }
    return Result.ok(TransactionResponseDto.fromEntity(transaction));
  }

  async syncStatus(id: string): Promise<Result<TransactionResponseDto>> {
    const result = await this.syncTransactionStatusUseCase.execute(id);
    if (result.isFailure) return Result.fail(result.getError());
    return Result.ok(TransactionResponseDto.fromEntity(result.getValue()));
  }
}
