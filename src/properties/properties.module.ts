import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  imports: [TypeOrmModule.forFeature([Property])],
  exports: [PropertiesService],
})
export class PropertiesModule {}
