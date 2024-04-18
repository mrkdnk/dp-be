import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspector } from './entities/inspector.entity';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { mapInspectorToGetInspectorDto } from './mappers/inspector.mapper';
import { UpdateInspectorDto } from './dto/update-inspector.dto';
import { GetInspectorDto } from './dto/get-inspector.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InspectorsService {
  constructor(
    @InjectRepository(Inspector)
    private readonly inspectorsRepository: Repository<Inspector>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createInspectorDto: CreateInspectorDto,
  ): Promise<GetInspectorDto> {
    const inspector = this.inspectorsRepository.create({
      ...createInspectorDto,
    });

    const savedInspector = await this.inspectorsRepository.save(inspector);
    await this.usersRepository.update(
      { id: createInspectorDto.userId },
      { inspectorId: savedInspector.id },
    );
    return mapInspectorToGetInspectorDto(savedInspector);
  }
  async update(
    id: number,
    updateInspectorDto: UpdateInspectorDto,
  ): Promise<GetInspectorDto> {
    const existingInspector: Inspector | null =
      await this.inspectorsRepository.findOne({
        where: { id: id },
      });
    if (!existingInspector) {
      throw new NotFoundException(`Inspector #${id} not found`);
    }

    const inspectors = await this.inspectorsRepository.preload({
      id: id,
      ...updateInspectorDto,
    });
    if (!inspectors) {
      throw new NotFoundException(`Inspector #${id} not found`);
    }
    const updatedInspector = await this.inspectorsRepository.save(inspectors);
    return mapInspectorToGetInspectorDto(updatedInspector);
  }
  async _createForTesting(
    createInspectorDto: CreateInspectorDto,
  ): Promise<Inspector> {
    const inspector = this.inspectorsRepository.create({
      ...createInspectorDto,
    });

    const savedInspector = await this.inspectorsRepository.save(inspector);
    await this.usersRepository.update(
      { id: createInspectorDto.userId },
      { inspectorId: savedInspector.id },
    );
    return savedInspector;
  }
}
