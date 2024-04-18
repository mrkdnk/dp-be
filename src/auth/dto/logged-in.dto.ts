import { AuthUserDto } from './auth-user.dto';
import { IsObject, IsString } from 'class-validator';

export class LoggedInDto {
  @IsString()
  readonly access_token: string;

  @IsObject()
  readonly user: AuthUserDto;
}
