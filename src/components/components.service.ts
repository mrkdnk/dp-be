import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { Repository } from 'typeorm';
import { CreateComponentDto } from './dto/create-component.dto';
import { GetComponentDto } from './dto/get-component.dto';
import { mapComponentToGetComponentDto } from './mappers/component.mapper';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private readonly componentsRepository: Repository<Component>,
  ) {}

  async create(
    createComponentDto: CreateComponentDto,
  ): Promise<GetComponentDto> {
    const createdComponent =
      await this.componentsRepository.save(createComponentDto);
    const loadedComponent = await this.componentsRepository.findOneOrFail({
      where: { id: createdComponent.id },
      relations: ['device', 'componentType'],
    });
    return mapComponentToGetComponentDto(loadedComponent);
  }

  async update(
    id: number,
    updateComponentDto: UpdateComponentDto,
  ): Promise<GetComponentDto> {
    const existingComponent: Component | null =
      await this.componentsRepository.findOne({
        where: { id: id },
      });
    if (!existingComponent) {
      throw new NotFoundException(`Component #${id} not found`);
    }

    const component = await this.componentsRepository.preload({
      id: id,
      ...updateComponentDto,
    });
    if (!component) {
      throw new NotFoundException(`Component #${id} not found`);
    }
    const updatedComponent = await this.componentsRepository.save(component);
    const loadedComponent = await this.componentsRepository.findOneOrFail({
      where: { id: updatedComponent.id },
      relations: ['device', 'componentType'],
    });
    return mapComponentToGetComponentDto(loadedComponent);
  }

  async findAll(): Promise<GetComponentDto[]> {
    const components: Component[] = await this.componentsRepository.find({});

    if (components.length === 0) return [];

    return components.map((component) =>
      mapComponentToGetComponentDto(component),
    );
  }

  async findOne(id: number): Promise<GetComponentDto> {
    const component: Component = await this.componentsRepository.findOneOrFail({
      where: { id },
    });
    return mapComponentToGetComponentDto(component);
  }

  async delete(id: number): Promise<GetComponentDto> {
    const component = await this.componentsRepository.findOneOrFail({
      where: { id: id },
    });
    const removedComponent = await this.componentsRepository.remove(component);
    return mapComponentToGetComponentDto(removedComponent);
  }

  async _createForTesting(
    createComponentDto: CreateComponentDto,
  ): Promise<Component> {
    const component = this.componentsRepository.create({
      ...createComponentDto,
    });

    return await this.componentsRepository.save(component);
  }
}
