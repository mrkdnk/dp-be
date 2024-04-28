import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SetupModule } from './setup/setup.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigHelper } from './common/helpers/config.helper';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OrganizationsModule } from './organizations/organizations.module';
import { CustomersModule } from './customers/customers.module';
import { InspectorsModule } from './inspectors/inspectors.module';
import { PropertiesModule } from './properties/properties.module';
import { DevicesModule } from './devices/devices.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { ComponentsModule } from './components/components.module';
import { ComponentTypesModule } from './component-types/component-types.module';
import { InspectionsModule } from './inspections/inspections.module';

ConfigHelper.load();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5439,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: process.env.NODE_ENV == 'production',
      autoLoadEntities: process.env.NODE_ENV != 'test', // models will be loaded automatically (you don't have to explicitly specify the entities: [] array)
      synchronize: process.env.NODE_ENV != 'test', // your entities will be synced with the database (ORM will map entities definitions to corresponding SQL tabled), every time you run the application (recommended: disable in the production)
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      logging: false,
    }),
    UsersModule,
    SetupModule,
    AuthModule,
    OrganizationsModule,
    CustomersModule,
    InspectorsModule,
    PropertiesModule,
    DevicesModule,
    DeviceTypesModule,
    ComponentsModule,
    ComponentTypesModule,
    InspectionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
