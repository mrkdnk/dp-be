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
import { InspectionsService } from './inspections.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { GetInspectionDto } from './dto/get-inspection.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { ENTITY_REMOVED } from '../common/entities/base.entity';

@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ResponseDto<GetInspectionDto[]>> {
    const inspections: GetInspectionDto[] =
      await this.inspectionsService.findAll();
    return ResponseFormatHelper.format<GetInspectionDto[]>(inspections);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetInspectionDto>> {
    const inspection: GetInspectionDto =
      await this.inspectionsService.findOne(id);
    return ResponseFormatHelper.format<GetInspectionDto>(inspection);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createInspectionDto: CreateInspectionDto,
  ): Promise<ResponseDto<GetInspectionDto>> {
    const createdInspection: GetInspectionDto =
      await this.inspectionsService.create(createInspectionDto);
    return ResponseFormatHelper.format<GetInspectionDto>(createdInspection);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ): Promise<ResponseDto<GetInspectionDto>> {
    const updatedInspection: GetInspectionDto =
      await this.inspectionsService.update(id, updateInspectionDto);
    return ResponseFormatHelper.format<GetInspectionDto>(updatedInspection);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.inspectionsService.delete(id);
    return ResponseFormatHelper.format<string>(ENTITY_REMOVED);
  }
}
