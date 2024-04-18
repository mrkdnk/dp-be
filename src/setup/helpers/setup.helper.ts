import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import {
  DynamicModule,
  ForwardReference,
  ModuleMetadata,
  Provider,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import {
  Services,
  SetupApp,
  SetupConfig,
  TestingUser,
  TestingUsers,
} from '../interfaces/setup.interfaces';
import { NestExpressApplication } from '@nestjs/platform-express';
import { customExceptionFactory } from '../../common/exceptions/custom-exception.factory';
import { DataSource } from 'typeorm';
import { ConfigHelper } from '../../common/helpers/config.helper';
import { RolesGuard } from '../../common/guards/roles-guard.service';
import { Role } from '../../users/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from '../../common/filters/all-exceptions.filter';
import { MagicCode } from '../../auth/entities/magic-code.entity';
import { SetupDataHelper } from './setup-data.helper';
import { OrganizationsService } from '../../organizations/organizations.service';
import { CustomersService } from '../../customers/customers.service';
import { InspectorsService } from '../../inspectors/inspectors.service';
import { PropertiesService } from '../../properties/properties.service';
import { DevicesService } from '../../devices/devices.service';
import { DeviceTypesService } from '../../device-types/device-types.service';
import { ComponentsService } from '../../components/components.service';
import { ComponentTypesService } from '../../component-types/component-types.service';
import { InspectionsService } from '../../inspections/inspections.service';

ConfigHelper.load();

export const BASE_USER_COUNT = 3;
export const BASE_DEVICE_TYPE_COUNT = 3;
export const BASE_COMPONENT_TYPE_COUNT = 10;

export class SetupHelper {
  constructor() {}
  async createSetupApp(config: SetupConfig): Promise<SetupApp> {
    const { moduleMetadata } = this.processConfigData();

    const moduleRef = await Test.createTestingModule(moduleMetadata).compile();

    const app: NestExpressApplication = moduleRef.createNestApplication();
    app.useGlobalPipes(validationPipe);
    app.useGlobalFilters(new AllExceptionsFilter());
    const reflector = moduleRef.get<Reflector>(Reflector);
    app.useGlobalGuards(new RolesGuard(reflector));
    await app.init();

    if (process.env.NODE_ENV === 'test') {
      const dataSource = app.get(DataSource);
      await dataSource.dropDatabase();
      await dataSource.synchronize(true);
    }

    const services: Services = this.setupServices(moduleRef);

    const users = await this.createTestingUsers(config.testName, services);
    await checkUserCount(services.usersService, BASE_USER_COUNT);
    const setupDataHelper = new SetupDataHelper(
      config,
      services,
      users.admin.user,
    );
    const data = await setupDataHelper.createTestingData();

    return {
      app,
      users: users,
      data: data,
    };
  }

  async createTestingUsers(
    testName: string,
    services: Services,
  ): Promise<TestingUsers> {
    const admin = await this.createTestingUser(testName, Role.ADMIN, services);
    const technician = await this.createTestingUser(
      testName,
      Role.TECHNICIAN,
      services,
    );
    const customer = await this.createTestingUser(
      testName,
      Role.CUSTOMER,
      services,
    );

    return {
      admin: admin,
      technician: technician,
      customer: customer,
    };
  }

  async createTestingUser(
    testName: string,
    role: Role,
    services: Services,
  ): Promise<TestingUser> {
    const { usersService, authService } = services;
    const user = await usersService.createForTesting({
      email: testName + '.' + role + '@electroinspection.com',
      firstName: 'John',
      lastName: role,
      role: role,
    });

    const magicCode = await authService.getMagicCode(
      {
        email: user.email,
      },
      '192.0.0.1',
    );
    const signIn = await authService.login({
      email: user.email,
      code: magicCode.magicCode,
    });

    return {
      user: user,
      token: signIn.access_token,
    };
  }

  processConfigData(): { moduleMetadata: ModuleMetadata } {
    const imports: Array<
      Type | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [
      AppModule,
      UsersModule,
      AuthModule,
      TypeOrmModule.forFeature([User, MagicCode]),
    ];

    const providers: Provider[] = [UsersService, AuthService];

    return {
      moduleMetadata: {
        imports: imports,
        providers: providers,
      },
    };
  }

  setupServices(moduleFixture: TestingModule): Services {
    const usersService = moduleFixture.get<UsersService>(UsersService);
    const authService = moduleFixture.get<AuthService>(AuthService);
    const organizationsService =
      moduleFixture.get<OrganizationsService>(OrganizationsService);
    const customersService =
      moduleFixture.get<CustomersService>(CustomersService);
    const inspectorsService =
      moduleFixture.get<InspectorsService>(InspectorsService);
    const propertiesService =
      moduleFixture.get<PropertiesService>(PropertiesService);
    const devicesService = moduleFixture.get<DevicesService>(DevicesService);
    const deviceTypesService =
      moduleFixture.get<DeviceTypesService>(DeviceTypesService);
    const componentsService =
      moduleFixture.get<ComponentsService>(ComponentsService);
    const componentTypesService = moduleFixture.get<ComponentTypesService>(
      ComponentTypesService,
    );
    const inspectionsService =
      moduleFixture.get<InspectionsService>(InspectionsService);

    return {
      usersService,
      authService,
      organizationsService,
      customersService,
      inspectorsService,
      propertiesService,
      devicesService,
      deviceTypesService,
      componentsService,
      componentTypesService,
      inspectionsService,
    };
  }
}

const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: customExceptionFactory,
});

async function checkUserCount(usersService: UsersService, count: number) {
  const users = await usersService._countAll();
  expect(users).toBe(count);
}
