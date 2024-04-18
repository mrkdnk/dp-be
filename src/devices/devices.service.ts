import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapDeviceToGetDeviceDto } from './mappers/device.mapper';
import { GetDeviceDto } from './dto/get-device.dto';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<GetDeviceDto> {
    const createdDevice = await this.devicesRepository.save(createDeviceDto);
    const loadedDevice = await this.devicesRepository.findOneOrFail({
      where: { id: createdDevice.id },
      relations: ['property', 'deviceType'],
    });
    return mapDeviceToGetDeviceDto(loadedDevice);
  }

  async update(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<GetDeviceDto> {
    const existingDevice: Device | null = await this.devicesRepository.findOne({
      where: { id: id },
    });
    if (!existingDevice) {
      throw new NotFoundException(`Device #${id} not found`);
    }

    const device = await this.devicesRepository.preload({
      id: id,
      ...updateDeviceDto,
    });
    if (!device) {
      throw new NotFoundException(`Device #${id} not found`);
    }
    const updatedDevice = await this.devicesRepository.save(device);
    const loadedDevice = await this.devicesRepository.findOneOrFail({
      where: { id: updatedDevice.id },
      relations: ['property', 'deviceType'],
    });
    return mapDeviceToGetDeviceDto(loadedDevice);
  }

  async findAll(): Promise<GetDeviceDto[]> {
    const devices: Device[] = await this.devicesRepository.find({});

    if (devices.length === 0) return [];

    return devices.map((device) => mapDeviceToGetDeviceDto(device));
  }

  async findOne(id: number): Promise<GetDeviceDto> {
    const device: Device = await this.devicesRepository.findOneOrFail({
      where: { id },
    });
    return mapDeviceToGetDeviceDto(device);
  }

  async delete(id: number): Promise<GetDeviceDto> {
    const device = await this.devicesRepository.findOneOrFail({
      where: { id: id },
    });
    const removedDevice = await this.devicesRepository.remove(device);
    return mapDeviceToGetDeviceDto(removedDevice);
  }

  async _createForTesting(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.devicesRepository.create({
      ...createDeviceDto,
    });

    return await this.devicesRepository.save(device);
  }
}
