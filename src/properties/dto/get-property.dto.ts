import { BaseDto } from '../../common/dto/base.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GetCustomerDto } from '../../customers/dto/get-customer.dto';
import { Customer } from '../../customers/entities/customer.entity';

export class GetPropertyDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly street: string;

  @ApiProperty()
  @IsString()
  readonly zipCode: string;

  @ApiProperty()
  @IsString()
  readonly city: string;

  @ApiProperty()
  @IsString()
  readonly country: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly customer?: Customer | GetCustomerDto;
}
