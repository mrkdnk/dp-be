import { AuthUserDto } from './auth-user.dto';
import { IsObject, IsString } from 'class-validator';

export class MagicCodeDto {
  @IsString()
  readonly magicCode: string;

  @IsObject()
  readonly user: AuthUserDto;
}
