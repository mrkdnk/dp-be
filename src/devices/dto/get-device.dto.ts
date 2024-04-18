import { BaseDto } from '../../common/dto/base.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../properties/entities/property.entity';
import { GetPropertyDto } from '../../properties/dto/get-property.dto';
import { DeviceType } from '../../device-types/entities/device-type.entity';
import { GetDeviceTypeDto } from '../../device-types/dto/get-device-type.dto';

export class GetDeviceDto extends BaseDto {
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
  readonly deviceType: DeviceType | GetDeviceTypeDto;
}
