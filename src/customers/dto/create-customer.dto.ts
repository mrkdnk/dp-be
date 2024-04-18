import { IsString } from 'class-validator';

export class CreateCustomerDto {
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

  @IsString()
  readonly businessId: string;

  @IsString()
  readonly vatId: string;
}
