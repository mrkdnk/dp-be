import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { GetInspectionDto } from './dto/get-inspection.dto';
import { mapInspectionToGetInspectionDto } from './mapper/inpsector.mapper';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionsRepository: Repository<Inspection>,
  ) {}

  async create(
    createInspectionDto: CreateInspectionDto,
  ): Promise<GetInspectionDto> {
    const createdInspection =
      await this.inspectionsRepository.save(createInspectionDto);
    const loadedInspection = await this.inspectionsRepository.findOneOrFail({
      where: { id: createdInspection.id },
      relations: ['property', 'device', 'inspector'],
    });
    return mapInspectionToGetInspectionDto(loadedInspection);
  }

  async update(
    id: number,
    updateInspectionDto: UpdateInspectionDto,
  ): Promise<GetInspectionDto> {
    const existingInspection: Inspection | null =
      await this.inspectionsRepository.findOne({
        where: { id: id },
      });
    if (!existingInspection) {
      throw new NotFoundException(`Inspection #${id} not found`);
    }

    const inspection = await this.inspectionsRepository.preload({
      id: id,
      ...updateInspectionDto,
    });
    if (!inspection) {
      throw new NotFoundException(`Inspection #${id} not found`);
    }
    const updatedInspection = await this.inspectionsRepository.save(inspection);
    const loadedInspection = await this.inspectionsRepository.findOneOrFail({
      where: { id: updatedInspection.id },
      relations: ['property', 'device', 'inspector'],
    });
    return mapInspectionToGetInspectionDto(loadedInspection);
  }

  async findAll(): Promise<GetInspectionDto[]> {
    const inspections: Inspection[] = await this.inspectionsRepository.find({});

    if (inspections.length === 0) return [];

    return inspections.map((inspection) =>
      mapInspectionToGetInspectionDto(inspection),
    );
  }

  async findOne(id: number): Promise<GetInspectionDto> {
    const inspection: Inspection =
      await this.inspectionsRepository.findOneOrFail({
        where: { id },
      });
    return mapInspectionToGetInspectionDto(inspection);
  }

  async delete(id: number): Promise<GetInspectionDto> {
    const inspection = await this.inspectionsRepository.findOneOrFail({
      where: { id: id },
    });
    const removedInspection =
      await this.inspectionsRepository.remove(inspection);
    return mapInspectionToGetInspectionDto(removedInspection);
  }

  async _createForTesting(
    createInspectionDto: CreateInspectionDto,
  ): Promise<Inspection> {
    const inspection = this.inspectionsRepository.create({
      ...createInspectionDto,
    });

    return await this.inspectionsRepository.save(inspection);
  }
}
