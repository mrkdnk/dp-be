import { IsEmail } from 'class-validator';

export class MagicCodeRequestDto {
  @IsEmail()
  readonly email: string;
}
