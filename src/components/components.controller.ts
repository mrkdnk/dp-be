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
import { ComponentsService } from './components.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { GetComponentDto } from './dto/get-component.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ENTITY_REMOVED } from '../common/entities/base.entity';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  // @Roles(Role.ADMIN)
  // @Get()
  // async findAll(): Promise<ResponseDto<GetComponentDto[]>> {
  //   const components: GetComponentDto[] =
  //     await this.componentsService.findAll();
  //   return ResponseFormatHelper.format<GetComponentDto[]>(components);
  // }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetComponentDto>> {
    const component: GetComponentDto = await this.componentsService.findOne(id);
    return ResponseFormatHelper.format<GetComponentDto>(component);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createComponentDto: CreateComponentDto,
  ): Promise<ResponseDto<GetComponentDto>> {
    const createdComponent: GetComponentDto =
      await this.componentsService.create(createComponentDto);
    return ResponseFormatHelper.format<GetComponentDto>(createdComponent);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComponentDto: UpdateComponentDto,
  ): Promise<ResponseDto<GetComponentDto>> {
    const updatedComponent: GetComponentDto =
      await this.componentsService.update(id, updateComponentDto);
    return ResponseFormatHelper.format<GetComponentDto>(updatedComponent);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.componentsService.delete(id);
    return ResponseFormatHelper.format<string>(ENTITY_REMOVED);
  }
}
