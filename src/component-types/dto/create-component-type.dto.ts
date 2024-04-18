import { IsString } from 'class-validator';

export class CreateComponentTypeDto {
  @IsString()
  readonly title: string;
}
