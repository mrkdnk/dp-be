import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';

@Module({
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  imports: [TypeOrmModule.forFeature([Organization])],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
