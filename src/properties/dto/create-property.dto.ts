import { IsNumber, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsNumber()
  readonly customerId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly street: string;

  @IsString()
  readonly zipCode: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly country: string;
}
