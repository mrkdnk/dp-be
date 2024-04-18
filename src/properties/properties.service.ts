import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { GetPropertyDto } from './dto/get-property.dto';
import { mapPropertyToGetPropertyDto } from './mapper/property.mapper';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<GetPropertyDto> {
    const createdProperty =
      await this.propertiesRepository.save(createPropertyDto);
    return mapPropertyToGetPropertyDto(createdProperty);
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<GetPropertyDto> {
    const existingProperty: Property | null =
      await this.propertiesRepository.findOne({
        where: { id: id },
      });
    if (!existingProperty) {
      throw new NotFoundException(`Property #${id} not found`);
    }

    const property = await this.propertiesRepository.preload({
      id: id,
      ...updatePropertyDto,
    });
    if (!property) {
      throw new NotFoundException(`Property #${id} not found`);
    }
    const updatedProperty = await this.propertiesRepository.save(property);
    return mapPropertyToGetPropertyDto(updatedProperty);
  }

  async findAll(): Promise<GetPropertyDto[]> {
    const properties: Property[] = await this.propertiesRepository.find({});

    if (properties.length === 0) return [];

    return properties.map((property) => mapPropertyToGetPropertyDto(property));
  }

  async findOne(id: number): Promise<GetPropertyDto> {
    const property: Property = await this.propertiesRepository.findOneOrFail({
      where: { id },
    });
    return mapPropertyToGetPropertyDto(property);
  }

  async delete(id: number): Promise<GetPropertyDto> {
    const property = await this.propertiesRepository.findOneOrFail({
      where: { id: id },
    });
    const removedProperty = await this.propertiesRepository.remove(property);
    return mapPropertyToGetPropertyDto(removedProperty);
  }

  async _createForTesting(
    createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    const property = this.propertiesRepository.create({
      ...createPropertyDto,
    });

    return await this.propertiesRepository.save(property);
  }
}
