import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { mapOrganizationToGetOrganizationDto } from './mappers/organization.mapper';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { GetOrganizationDto } from './dto/get-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<GetOrganizationDto> {
    const createdOrganization = await this.organizationRepository.save(
      createOrganizationDto,
    );
    return mapOrganizationToGetOrganizationDto(createdOrganization);
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<GetOrganizationDto> {
    const existingOrganization: Organization | null =
      await this.organizationRepository.findOne({
        where: { id: id },
      });
    if (!existingOrganization) {
      throw new NotFoundException(`Organization #${id} not found`);
    }

    const organization = await this.organizationRepository.preload({
      id: id,
      ...updateOrganizationDto,
    });
    if (!organization) {
      throw new NotFoundException(`Organization #${id} not found`);
    }
    const updatedOrganization =
      await this.organizationRepository.save(organization);
    return mapOrganizationToGetOrganizationDto(updatedOrganization);
  }

  async findAll(): Promise<GetOrganizationDto[]> {
    const organizations: Organization[] =
      await this.organizationRepository.find({});

    if (organizations.length === 0) return [];

    return organizations.map((organization) =>
      mapOrganizationToGetOrganizationDto(organization),
    );
  }

  async findOne(id: number): Promise<GetOrganizationDto> {
    const organization: Organization =
      await this.organizationRepository.findOneOrFail({
        where: { id },
      });
    return mapOrganizationToGetOrganizationDto(organization);
  }

  async delete(id: number): Promise<GetOrganizationDto> {
    const organization = await this.organizationRepository.findOneOrFail({
      where: { id: id },
    });
    const removedOrganization =
      await this.organizationRepository.remove(organization);
    return mapOrganizationToGetOrganizationDto(removedOrganization);
  }

  async _createForTesting(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = this.organizationRepository.create({
      ...createOrganizationDto,
    });

    return await this.organizationRepository.save(organization);
  }
}
