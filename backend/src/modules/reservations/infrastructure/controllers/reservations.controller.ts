import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { ReleaseReservationUseCase } from '../../application/use-cases/release-reservation.use-case';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';
import { ReservationResponseDto } from '../../application/dto/reservation-response.dto';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservation: CreateReservationUseCase,
    private readonly releaseReservation: ReleaseReservationUseCase,
  ) {}

  @Post()
  @PublicEndpoint()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reserve stock for checkout (TTL: 15 min)' })
  @ApiResponse({ status: 201, type: ReservationResponseDto })
  async create(
    @Body() dto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const result = await this.createReservation.execute(
      dto.sessionId,
      dto.items,
    );
    const entities = unwrap(result);
    return ReservationResponseDto.fromEntities(entities);
  }

  @Delete(':sessionId')
  @PublicEndpoint()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Release a stock reservation' })
  @ApiResponse({ status: 204 })
  async release(@Param('sessionId') sessionId: string): Promise<void> {
    await this.releaseReservation.execute(sessionId);
  }
}
