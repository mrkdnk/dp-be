import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggedInUser } from './decorators/users.decorator';
import { User, USER_REMOVED } from './entities/user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { InspectorsService } from '../inspectors/inspectors.service';
import { CreateInspectorDto } from '../inspectors/dto/create-inspector.dto';
import { GetInspectorDto } from '../inspectors/dto/get-inspector.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly inspectorsService: InspectorsService,
  ) {}

  @Get()
  async findAll(
    @LoggedInUser() user: User,
  ): Promise<ResponseDto<GetUserDto[]>> {
    const users: GetUserDto[] = await this.usersService.findAll(user);
    return ResponseFormatHelper.format<GetUserDto[]>(users);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @LoggedInUser() loggedInUser: User,
  ): Promise<ResponseDto<GetUserDto>> {
    const user: GetUserDto = await this.usersService.findOne(id, loggedInUser);
    return ResponseFormatHelper.format<GetUserDto>(user);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<GetUserDto>> {
    const createdUser: GetUserDto =
      await this.usersService.create(createUserDto);
    return ResponseFormatHelper.format<GetUserDto>(createdUser);
  }

  @Roles(Role.ADMIN)
  @Post(':id/inspectors')
  @HttpCode(HttpStatus.CREATED)
  async addInspector(
    @Param('id', ParseIntPipe) id: number,
    @Body() createInspectorDto: CreateInspectorDto,
  ): Promise<ResponseDto<GetInspectorDto>> {
    const createdInspector: GetInspectorDto =
      await this.inspectorsService.create(createInspectorDto);
    return ResponseFormatHelper.format<GetInspectorDto>(createdInspector);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<GetUserDto>> {
    const updatedUser: GetUserDto = await this.usersService.update(
      id,
      updateUserDto,
    );
    return ResponseFormatHelper.format<GetUserDto>(updatedUser);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.usersService.delete(id);
    return ResponseFormatHelper.format<string>(USER_REMOVED);
  }
}
