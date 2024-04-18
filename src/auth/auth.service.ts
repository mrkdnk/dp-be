import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoggedInDto } from './dto/logged-in.dto';
import { mapAuthToGetAuthDto } from './mappers/auth.mapper';
import { LoginDto } from './dto/login.dto';
import { MagicCodeRequestDto } from './dto/magic-code-request.dto';
import { MagicCodeDto } from './dto/magic-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MagicCode, MagicCodeStatus } from './entities/magic-code.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(MagicCode)
    private readonly magicCodeRepository: Repository<MagicCode>,
  ) {}

  async validateUser(email: string, code: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const magicCode = await this.magicCodeRepository.findOne({
      where: {
        userId: user.id,
        code,
        status: MagicCodeStatus.ACTIVE,
      },
    });
    if (!magicCode) {
      return null;
    }
    const { ...result } = user;
    return result;
  }

  async login(user: LoginDto): Promise<LoggedInDto> {
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);

    const isValid = await this.validateUser(user.email, user.code);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    /// TODO: do not allow to login if user is not active or is deleted
    const foundUser = await this.usersService.findOneByEmail(user.email);

    return {
      access_token: token,
      user: mapAuthToGetAuthDto(foundUser),
    };
  }

  async getMagicCode(
    data: MagicCodeRequestDto,
    ip: string | string[] | undefined,
  ): Promise<MagicCodeDto> {
    // TODO: do not allow to login if user is not active or is deleted
    // TODO: handle undefined IP
    await this.usersService.findOneByEmail(data.email);
    const foundUser = await this.usersService.findOneByEmail(data.email);
    const magicCodeValue = Math.floor(100000 + Math.random() * 900000);
    const magicCode = this.magicCodeRepository.create({
      userId: foundUser.id,
      code: magicCodeValue.toString(),
      ip: ip as string,
    });
    const savedMagicCode = await this.magicCodeRepository.save(magicCode);
    // TODO:  send magic code to user email
    return {
      user: foundUser,
      magicCode: savedMagicCode.code,
    };
  }
}
