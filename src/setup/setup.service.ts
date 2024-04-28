import { Injectable } from '@nestjs/common';
import { SetupApp, SetupData } from './interfaces/setup.interfaces';
import { SetupHelper } from './helpers/setup.helper';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const ADMIN_COUNT = 5;
const TECHNICIAN_COUNT = 5;
const CUSTOMER_COUNT = 5;
const CUSTOMER_ENTITY_COUNT = 1;
const PROPERTY_COUNT = 2;
const DEVICE_COUNT = 5;
const INSPECTION_COUNT = 5;

@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(): Promise<SetupData | undefined> {
    const testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'setup-helper',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
      customers: {
        count: CUSTOMER_ENTITY_COUNT,
        properties: {
          count: PROPERTY_COUNT,
          devices: {
            count: DEVICE_COUNT,
          },
        },
      },
      inspections: {
        count: INSPECTION_COUNT,
      },
    });

    return {
      users: [
        testingApp.users.admin.user,
        testingApp.users.customer.user,
        testingApp.users.technician.user,
      ],
    };
  }
}
