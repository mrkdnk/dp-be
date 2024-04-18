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
import { PropertiesService } from './properties.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { GetPropertyDto } from './dto/get-property.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ENTITY_REMOVED } from '../common/entities/base.entity';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ResponseDto<GetPropertyDto[]>> {
    const properties: GetPropertyDto[] = await this.propertiesService.findAll();
    return ResponseFormatHelper.format<GetPropertyDto[]>(properties);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetPropertyDto>> {
    const property: GetPropertyDto = await this.propertiesService.findOne(id);
    return ResponseFormatHelper.format<GetPropertyDto>(property);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<ResponseDto<GetPropertyDto>> {
    const createdProperty: GetPropertyDto =
      await this.propertiesService.create(createPropertyDto);
    return ResponseFormatHelper.format<GetPropertyDto>(createdProperty);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<ResponseDto<GetPropertyDto>> {
    const updatedProperty: GetPropertyDto = await this.propertiesService.update(
      id,
      updatePropertyDto,
    );
    return ResponseFormatHelper.format<GetPropertyDto>(updatedProperty);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.propertiesService.delete(id);
    return ResponseFormatHelper.format<string>(ENTITY_REMOVED);
  }
}
