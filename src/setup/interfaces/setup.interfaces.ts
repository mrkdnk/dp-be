import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { INestApplication } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { GetUserDto } from '../../users/dto/get-user.dto';
import { OrganizationsService } from '../../organizations/organizations.service';
import { Organization } from '../../organizations/entities/organization.entity';
import { GetOrganizationDto } from '../../organizations/dto/get-organization.dto';
import { Customer } from '../../customers/entities/customer.entity';
import { GetCustomerDto } from '../../customers/dto/get-customer.dto';
import { CustomersService } from '../../customers/customers.service';
import { InspectorsService } from '../../inspectors/inspectors.service';
import { GetPropertyDto } from '../../properties/dto/get-property.dto';
import { Property } from '../../properties/entities/property.entity';
import { PropertiesService } from '../../properties/properties.service';
import { Device } from '../../devices/entities/device.entity';
import { GetDeviceDto } from '../../devices/dto/get-device.dto';
import { DevicesService } from '../../devices/devices.service';
import { DeviceTypesService } from '../../device-types/device-types.service';
import { GetDeviceTypeDto } from '../../device-types/dto/get-device-type.dto';
import { DeviceType } from '../../device-types/entities/device-type.entity';
import { GetComponentDto } from '../../components/dto/get-component.dto';
import { Component } from '../../components/entities/component.entity';
import { ComponentType } from '../../component-types/entities/component-type.entity';
import { GetComponentTypeDto } from '../../component-types/dto/get-component-type.dto';
import { ComponentsService } from '../../components/components.service';
import { ComponentTypesService } from '../../component-types/component-types.service';
import { Inspection } from '../../inspections/entities/inspection.entity';
import { GetInspectionDto } from '../../inspections/dto/get-inspection.dto';
import { InspectionsService } from '../../inspections/inspections.service';
import { Inspector } from '../../inspectors/entities/inspector.entity';
import { GetInspectorDto } from '../../inspectors/dto/get-inspector.dto';

export interface SetupApp {
  app: INestApplication;
  users: TestingUsers;
  data: SetupData;
  // token: string;
}

export interface TestingUsers {
  admin: TestingUser;
  technician: TestingUser;
  customer: TestingUser;
}

export interface TestingUser {
  user: User;
  token: string;
}

export interface Services {
  usersService: UsersService;
  authService: AuthService;
  organizationsService: OrganizationsService;
  customersService: CustomersService;
  inspectorsService: InspectorsService;
  propertiesService: PropertiesService;
  devicesService: DevicesService;
  deviceTypesService: DeviceTypesService;
  componentsService: ComponentsService;
  componentTypesService: ComponentTypesService;
  inspectionsService: InspectionsService;
}

export interface SetupData {
  users?: User[] | GetUserDto[];
  organizations?: Organization[] | GetOrganizationDto[];
  customers?: Customer[] | GetCustomerDto[];
  properties?: Property[] | GetPropertyDto[];
  devices?: Device[] | GetDeviceDto[];
  deviceTypes?: DeviceType[] | GetDeviceTypeDto[];
  components?: Component[] | GetComponentDto[];
  componentTypes?: ComponentType[] | GetComponentTypeDto[];
  inspections?: Inspection[] | GetInspectionDto[];
  inspectors?: Inspector[] | GetInspectorDto[];
  // TODO: add attachments?
}

export interface SetupConfig {
  testName: string;
  users?: {
    admin?: number;
    technician?: number;
    customer?: number;
  };
  organizations?: {
    count?: number;
  };
  customers?: {
    count?: number;
    properties?: {
      count?: number;
      devices?: {
        count?: number;
        components?: {
          count?: number;
        };
      };
    };
  };
  inspections?: {
    count?: number;
  };
}
