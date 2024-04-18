import { IsNumber, IsString } from 'class-validator';

export class CreateComponentDto {
  @IsNumber()
  readonly deviceId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly componentTypeId: number;
}
