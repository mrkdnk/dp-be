import { Module } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceType } from './entities/device-type.entity';

@Module({
  providers: [DeviceTypesService],
  controllers: [DeviceTypesController],
  imports: [TypeOrmModule.forFeature([DeviceType])],
  exports: [DeviceTypesService],
})
export class DeviceTypesModule {}
