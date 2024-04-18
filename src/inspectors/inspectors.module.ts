import { Module } from '@nestjs/common';
import { InspectorsService } from './inspectors.service';
import { InspectorsController } from './inspectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspector } from './entities/inspector.entity';
import { User } from '../users/entities/user.entity';

@Module({
  providers: [InspectorsService],
  controllers: [InspectorsController],
  imports: [TypeOrmModule.forFeature([Inspector, User])],
  exports: [InspectorsService],
})
export class InspectorsModule {}
