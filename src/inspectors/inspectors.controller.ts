import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { InspectorsService } from './inspectors.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { GetInspectorDto } from './dto/get-inspector.dto';
import { UpdateInspectorDto } from './dto/update-inspector.dto';

@Controller('inspectors')
export class InspectorsController {
  constructor(private readonly inspectorsService: InspectorsService) {}

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInspectorDto: UpdateInspectorDto,
  ): Promise<ResponseDto<GetInspectorDto>> {
    const updatedInspector: GetInspectorDto =
      await this.inspectorsService.update(id, updateInspectorDto);
    return ResponseFormatHelper.format<GetInspectorDto>(updatedInspector);
  }
}
