import { IsString } from 'class-validator';

export class BaseDto {
  @IsString()
  readonly created: string;

  @IsString()
  readonly updated: string;
}
