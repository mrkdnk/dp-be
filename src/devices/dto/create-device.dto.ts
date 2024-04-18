import { IsNumber, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsNumber()
  readonly propertyId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly deviceTypeId: number;
}
