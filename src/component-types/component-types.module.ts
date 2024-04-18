import { Module } from '@nestjs/common';
import { ComponentTypesService } from './component-types.service';
import { ComponentTypesController } from './component-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentType } from './entities/component-type.entity';

@Module({
  providers: [ComponentTypesService],
  controllers: [ComponentTypesController],
  imports: [TypeOrmModule.forFeature([ComponentType])],
  exports: [ComponentTypesService],
})
export class ComponentTypesModule {}
