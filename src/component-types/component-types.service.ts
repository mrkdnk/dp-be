import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentType } from './entities/component-type.entity';
import { CreateComponentTypeDto } from './dto/create-component-type.dto';

@Injectable()
export class ComponentTypesService {
  constructor(
    @InjectRepository(ComponentType)
    private readonly componentTypesRepository: Repository<ComponentType>,
  ) {}

  async _createForTesting(
    createComponentTypeDto: CreateComponentTypeDto,
  ): Promise<ComponentType> {
    const componentType = this.componentTypesRepository.create({
      ...createComponentTypeDto,
    });

    return await this.componentTypesRepository.save(componentType);
  }
}
