import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { LoggedInDto } from './dto/logged-in.dto';
import { MagicCodeRequestDto } from './dto/magic-code-request.dto';
import { MagicCodeDto } from './dto/magic-code.dto';
import { ConfigHelper } from '../common/helpers/config.helper';
import {
  MAGIC_CODE_REQUEST_FAILED,
  MAGIC_CODE_REQUESTED,
} from './entities/magic-code.entity';

ConfigHelper.load();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto) {
    try {
      const loggedInUser: LoggedInDto = await this.authService.login(data);
      return ResponseFormatHelper.format<LoggedInDto>(loggedInUser);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Wrong credentials',
        });
      }
    }
    return;
  }

  @Public()
  @Post('/magic-code')
  @HttpCode(HttpStatus.OK)
  async getMagicCode(
    @Body() data: MagicCodeRequestDto,
    @Req() request: Request,
  ) {
    const ip = request.ip;
    try {
      const magicCode: MagicCodeDto = await this.authService.getMagicCode(
        data,
        ip,
      );
      if (process.env.NODE_ENV === 'test') {
        return ResponseFormatHelper.format<MagicCodeDto>(magicCode);
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'test') {
        return ResponseFormatHelper.format<string>(MAGIC_CODE_REQUEST_FAILED);
      }
    }
    return ResponseFormatHelper.format<string>(MAGIC_CODE_REQUESTED);
  }
}
