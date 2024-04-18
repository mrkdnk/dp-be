import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceType } from './entities/device-type.entity';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';

@Injectable()
export class DeviceTypesService {
  constructor(
    @InjectRepository(DeviceType)
    private readonly deviceTypesRepository: Repository<DeviceType>,
  ) {}

  async _createForTesting(
    createDeviceTypeDto: CreateDeviceTypeDto,
  ): Promise<DeviceType> {
    const deviceType = this.deviceTypesRepository.create({
      ...createDeviceTypeDto,
    });

    return await this.deviceTypesRepository.save(deviceType);
  }
}
