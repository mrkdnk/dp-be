import { BaseDto } from '../../common/dto/base.dto';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { Inspector } from '../../inspectors/entities/inspector.entity';
import { GetInspectorDto } from '../../inspectors/dto/get-inspector.dto';

export class GetUserDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly role: Role;

  @ApiPropertyOptional()
  @IsOptional()
  readonly inspector?: Inspector | GetInspectorDto;
}
