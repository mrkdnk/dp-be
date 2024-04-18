import { BaseDto } from '../../common/dto/base.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../../component-types/entities/component-type.entity';
import { GetComponentTypeDto } from '../../component-types/dto/get-component-type.dto';
import { GetDeviceDto } from '../../devices/dto/get-device.dto';
import { Device } from '../../devices/entities/device.entity';

export class GetComponentDto extends BaseDto {
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
  readonly device: Device | GetDeviceDto;

  @ApiProperty()
  readonly componentType: ComponentType | GetComponentTypeDto;
}
