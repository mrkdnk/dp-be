import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [SetupController],
  providers: [SetupService],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [SetupService],
})
export class SetupModule {}
