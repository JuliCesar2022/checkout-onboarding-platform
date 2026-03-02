import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsPositive,
  IsEmail,
  MinLength,
  IsOptional,
  ValidateNested,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CardDataDto {
  @ApiProperty({ example: 'tok_stagtest_...' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'VISA' })
  @IsString()
  brand: string;

  @ApiProperty({ example: '4242' })
  @IsString()
  lastFour: string;

  // installments - default 1 for single payment
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  installments?: number;
}

export class DeliveryDataDto {
  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiPropertyOptional({ example: 'Apartamento 502' })
  @IsOptional()
  @IsString()
  addressDetail?: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Cundinamarca' })
  @IsString()
  state: string;

  @ApiPropertyOptional({ example: '110111' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Postal code must be 6 digits' })
  postalCode?: string;
}

export class CustomerDataDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: '+573001234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: CardDataDto })
  @ValidateNested()
  @Type(() => CardDataDto)
  cardData: CardDataDto;

  @ApiProperty({ type: DeliveryDataDto })
  @ValidateNested()
  @Type(() => DeliveryDataDto)
  deliveryData: DeliveryDataDto;

  @ApiProperty({ type: CustomerDataDto })
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customerData: CustomerDataDto;

  /** Wompi acceptance token (required by Wompi to confirm T&C acceptance) */
  @ApiProperty()
  @IsString()
  acceptanceToken: string;

  @ApiProperty()
  @IsString()
  acceptPersonalAuth: string;
}
