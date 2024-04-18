import { IsNumber, IsString } from 'class-validator';

export class CreateInspectionDto {
  @IsNumber()
  readonly propertyId: number;

  @IsNumber()
  readonly deviceId: number;

  @IsNumber()
  readonly inspectorId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
