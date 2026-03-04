import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveItemDto {
  @ApiProperty({ description: 'Product ID to reserve' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to reserve', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateReservationDto {
  @ApiProperty({
    description: 'Frontend session ID (unique per browser session)',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'List of products and quantities to reserve',
    type: [ReserveItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReserveItemDto)
  items: ReserveItemDto[];
}
