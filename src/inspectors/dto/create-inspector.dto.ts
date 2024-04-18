import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInspectorDto {
  @ApiProperty()
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @IsString()
  readonly licence: string;

  @ApiProperty()
  @IsDate()
  readonly licenceValidFrom: Date;

  @ApiProperty()
  @IsDate()
  readonly licenceValidTo: Date;

  @ApiProperty()
  @IsString()
  readonly certificate: string;

  @ApiProperty()
  @IsDate()
  readonly certificateValidFrom: Date;

  @ApiProperty()
  @IsDate()
  readonly certificateValidTo: Date;
}
