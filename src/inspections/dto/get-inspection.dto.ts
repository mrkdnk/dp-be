import { BaseDto } from '../../common/dto/base.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../properties/entities/property.entity';
import { GetPropertyDto } from '../../properties/dto/get-property.dto';
import { GetDeviceDto } from '../../devices/dto/get-device.dto';
import { Device } from '../../devices/entities/device.entity';
import { Inspector } from '../../inspectors/entities/inspector.entity';
import { GetInspectorDto } from '../../inspectors/dto/get-inspector.dto';

export class GetInspectionDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  readonly property: Property | GetPropertyDto;

  @ApiProperty()
  readonly device: Device | GetDeviceDto;

  @ApiProperty()
  readonly inspector: Inspector | GetInspectorDto;
}
