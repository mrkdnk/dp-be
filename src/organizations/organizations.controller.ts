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
import { ORGANIZATION_REMOVED } from './entities/organization.entity';
import { ResponseDto } from '../common/dto/response.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ResponseDto<GetOrganizationDto[]>> {
    const organizations: GetOrganizationDto[] =
      await this.organizationsService.findAll();
    return ResponseFormatHelper.format<GetOrganizationDto[]>(organizations);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetOrganizationDto>> {
    const organization: GetOrganizationDto =
      await this.organizationsService.findOne(id);
    return ResponseFormatHelper.format<GetOrganizationDto>(organization);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<ResponseDto<GetOrganizationDto>> {
    const createdOrganization: GetOrganizationDto =
      await this.organizationsService.create(createOrganizationDto);
    return ResponseFormatHelper.format<GetOrganizationDto>(createdOrganization);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ResponseDto<GetOrganizationDto>> {
    const updatedOrganization: GetOrganizationDto =
      await this.organizationsService.update(id, updateOrganizationDto);
    return ResponseFormatHelper.format<GetOrganizationDto>(updatedOrganization);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.organizationsService.delete(id);
    return ResponseFormatHelper.format<string>(ORGANIZATION_REMOVED);
  }
}
