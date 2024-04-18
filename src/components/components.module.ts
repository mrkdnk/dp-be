import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';

@Module({
  providers: [ComponentsService],
  controllers: [ComponentsController],
  imports: [TypeOrmModule.forFeature([Component])],
  exports: [ComponentsService],
})
export class ComponentsModule {}
