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
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { GetDeviceDto } from './dto/get-device.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ENTITY_REMOVED } from '../common/entities/base.entity';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ResponseDto<GetDeviceDto[]>> {
    const devices: GetDeviceDto[] = await this.devicesService.findAll();
    return ResponseFormatHelper.format<GetDeviceDto[]>(devices);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetDeviceDto>> {
    const device: GetDeviceDto = await this.devicesService.findOne(id);
    return ResponseFormatHelper.format<GetDeviceDto>(device);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<ResponseDto<GetDeviceDto>> {
    const createdDevice: GetDeviceDto =
      await this.devicesService.create(createDeviceDto);
    return ResponseFormatHelper.format<GetDeviceDto>(createdDevice);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<ResponseDto<GetDeviceDto>> {
    const updatedDevice: GetDeviceDto = await this.devicesService.update(
      id,
      updateDeviceDto,
    );
    return ResponseFormatHelper.format<GetDeviceDto>(updatedDevice);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.devicesService.delete(id);
    return ResponseFormatHelper.format<string>(ENTITY_REMOVED);
  }
}
