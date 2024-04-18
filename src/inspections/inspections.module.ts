import { Module } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from './entities/inspection.entity';

@Module({
  providers: [InspectionsService],
  controllers: [InspectionsController],
  imports: [TypeOrmModule.forFeature([Inspection])],
  exports: [InspectionsService],
})
export class InspectionsModule {}
