import { IsString } from 'class-validator';

export class CreateDeviceTypeDto {
  @IsString()
  readonly title: string;
}
