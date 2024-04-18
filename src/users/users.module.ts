import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Inspector } from '../inspectors/entities/inspector.entity';
import { InspectorsModule } from '../inspectors/inspectors.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Inspector]), InspectorsModule],
  exports: [UsersService],
})
export class UsersModule {}
