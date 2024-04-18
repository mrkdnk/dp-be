import { User } from '../../users/entities/user.entity';
import {
  Services,
  SetupConfig,
  SetupData,
} from '../interfaces/setup.interfaces';
import { UsersService } from '../../users/users.service';
import { Role } from '../../users/enums/role.enum';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationsService } from '../../organizations/organizations.service';
import { CreateOrganizationDto } from '../../organizations/dto/create-organization.dto';
import { Customer } from '../../customers/entities/customer.entity';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
import { CustomersService } from '../../customers/customers.service';
import { InspectorsService } from '../../inspectors/inspectors.service';
import { Inspector } from '../../inspectors/entities/inspector.entity';
import { Property } from '../../properties/entities/property.entity';
import { CreatePropertyDto } from '../../properties/dto/create-property.dto';
import { PropertiesService } from '../../properties/properties.service';
import { Device } from '../../devices/entities/device.entity';
import { CreateDeviceDto } from '../../devices/dto/create-device.dto';
import { DevicesService } from '../../devices/devices.service';
import { DeviceTypesService } from '../../device-types/device-types.service';
import { CreateDeviceTypeDto } from '../../device-types/dto/create-device-type.dto';
import { DeviceType } from '../../device-types/entities/device-type.entity';
import {
  BASE_COMPONENT_TYPE_COUNT,
  BASE_DEVICE_TYPE_COUNT,
} from './setup.helper';
import { Component } from '../../components/entities/component.entity';
import { ComponentType } from '../../component-types/entities/component-type.entity';
import { CreateComponentTypeDto } from '../../component-types/dto/create-component-type.dto';
import { ComponentTypesService } from '../../component-types/component-types.service';
import { ComponentsService } from '../../components/components.service';
import { CreateComponentDto } from '../../components/dto/create-component.dto';
import { Inspection } from '../../inspections/entities/inspection.entity';
import { CreateInspectionDto } from '../../inspections/dto/create-inspection.dto';
import { InspectionsService } from '../../inspections/inspections.service';

export class SetupDataHelper {
  config: SetupConfig;
  usersService: UsersService;
  organizationsService: OrganizationsService;
  customersService: CustomersService;
  inspectorsService: InspectorsService;
  propertiesService: PropertiesService;
  devicesService: DevicesService;
  deviceTypesService: DeviceTypesService;
  componentsService: ComponentsService;
  componentTypesService: ComponentTypesService;
  inspectionsService: InspectionsService;
  user: User;
  constructor(config: SetupConfig, services: Services, user: User) {
    this.usersService = services.usersService;
    this.organizationsService = services.organizationsService;
    this.customersService = services.customersService;
    this.inspectorsService = services.inspectorsService;
    this.propertiesService = services.propertiesService;
    this.devicesService = services.devicesService;
    this.deviceTypesService = services.deviceTypesService;
    this.componentsService = services.componentsService;
    this.componentTypesService = services.componentTypesService;
    this.inspectionsService = services.inspectionsService;
    this.config = config;
    this.user = user;
  }

  async createTestingData(): Promise<SetupData> {
    // create users
    const users: User[] = [];
    const inspectors: Inspector[] = [];
    if (this.config.users) {
      if (this.config.users.admin) {
        for (let i = 0; i < this.config.users.admin; i++) {
          const user = await this.createAdminUser('Admin' + i);
          users.push(user);
        }
      }
      if (this.config.users.technician) {
        for (let i = 0; i < this.config.users.technician; i++) {
          const user = await this.createTechnicianUser('Technician' + i);
          await this.createInspector('Inspector' + i, user.id);
          const userWithInspector =
            await this.usersService.findOneWithInspector(user.id);
          users.push(userWithInspector);
          inspectors.push(userWithInspector.inspector);
        }
      }
      if (this.config.users.customer) {
        for (let i = 0; i < this.config.users.customer; i++) {
          const user = await this.createCustomerUser('Customer' + i);
          users.push(user);
        }
      }
    }

    // create organizations
    const organizations: Organization[] = [];
    if (this.config.organizations?.count) {
      for (let i = 0; i < this.config.organizations.count; i++) {
        const organization = await this.createOrganization('Organization ' + i);
        organizations.push(organization);
      }
    }
    // create customers
    const customers: Customer[] = [];
    if (this.config.customers?.count) {
      for (let i = 0; i < this.config.customers.count; i++) {
        const customer = await this.createCustomer('Customer ' + i);
        customers.push(customer);
      }
    }
    // create properties
    const properties: Property[] = [];
    if (
      this.config.customers?.count &&
      this.config.customers?.properties?.count
    ) {
      for (let i = 0; i < customers.length; i++) {
        for (let j = 0; j < this.config.customers.properties.count; j++) {
          const property = await this.createProperty(
            'Property ' + i + '.' + j,
            customers[i].id,
          );
          properties.push(property);
        }
      }
    }

    // create device types
    const deviceTypes: DeviceType[] = [];
    for (let i = 0; i < BASE_DEVICE_TYPE_COUNT; i++) {
      const deviceType = await this.createDeviceType('DeviceType ' + i);
      deviceTypes.push(deviceType);
    }

    // create devices
    const devices: Device[] = [];
    const deviceCount = this.config.customers?.properties?.devices?.count;
    if (properties.length && deviceCount) {
      for (let i = 0; i < properties.length; i++) {
        for (let j = 0; j < deviceCount; j++) {
          const device = await this.createDevice(
            'Device ' + i + '.' + j,
            properties[i].id,
            deviceTypes[j % BASE_DEVICE_TYPE_COUNT].id,
          );
          devices.push(device);
        }
      }
    }

    // create component types
    const componentTypes: ComponentType[] = [];
    for (let i = 0; i < BASE_COMPONENT_TYPE_COUNT; i++) {
      const componentType = await this.createComponentType(
        'ComponentType ' + i,
      );
      componentTypes.push(componentType);
    }

    // create components
    const components: Component[] = [];
    const componentCount =
      this.config.customers?.properties?.devices?.components?.count;
    if (devices.length && componentCount) {
      for (let i = 0; i < devices.length; i++) {
        for (let j = 0; j < componentCount; j++) {
          const component = await this.createComponent(
            'Component ' + i + '.' + j,
            devices[i].id,
            deviceTypes[j % BASE_DEVICE_TYPE_COUNT].id,
          );
          components.push(component);
        }
      }
    }

    // create inspections
    const inspections: Inspection[] = [];
    if (
      inspectors.length &&
      properties.length &&
      devices.length &&
      this.config.inspections?.count
    ) {
      for (let i = 0; i < this.config.inspections.count; i++) {
        const inspection = await this.createInspection(
          'Inspection ' + i,
          devices[i % devices.length].id,
          properties[i % properties.length].id,
          inspectors[i % inspectors.length].id,
        );
        inspections.push(inspection);
      }
    }
    return {
      users: users,
      organizations: organizations,
      customers: customers,
      properties: properties,
      devices: devices,
      deviceTypes: deviceTypes,
      components: components,
      componentTypes: componentTypes,
      inspections: inspections,
      inspectors: inspectors,
    };
  }
  async createAdminUser(name: string): Promise<User> {
    return await this.createUser(name, Role.ADMIN);
  }
  async createTechnicianUser(name: string): Promise<User> {
    // TODO: add organization
    return await this.createUser(name, Role.TECHNICIAN);
  }
  async createCustomerUser(name: string): Promise<User> {
    // TODO: add customer
    return await this.createUser(name, Role.CUSTOMER);
  }

  async createUser(name: string, role: Role): Promise<User> {
    const userDto = {
      firstName: 'John',
      lastName: name,
      email: name + '.' + role + '@electroinspection.com',
      role: role,
    };
    return await this.usersService.createForTesting(userDto);
  }

  async createOrganization(name: string): Promise<Organization> {
    const organizationDto: CreateOrganizationDto = {
      title: name,
      description: 'Description for ' + name,
      street: 'Street ' + name,
      city: 'City ' + name,
      country: 'Country ' + name,
      businessId: 'BusinessId ' + name,
      vatId: 'VatId ' + name,
      zipCode: 'ZipCode ' + name,
    };
    return await this.organizationsService._createForTesting(organizationDto);
  }

  async createCustomer(name: string): Promise<Customer> {
    const customerDto: CreateCustomerDto = {
      title: name,
      description: 'Description for ' + name,
      street: 'Street ' + name,
      city: 'City ' + name,
      country: 'Country ' + name,
      businessId: 'BusinessId ' + name,
      vatId: 'VatId ' + name,
      zipCode: 'ZipCode ' + name,
    };
    return await this.customersService._createForTesting(customerDto);
  }

  async createInspector(name: string, userId: number): Promise<Inspector> {
    const inspectorDto = {
      userId: userId,
      licence: 'Licence ' + name,
      licenceValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      licenceValidTo: new Date('2025-12-31T23:59:59.999Z'),
      certificate: 'Certificate ' + name,
      certificateValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      certificateValidTo: new Date('2025-12-31T23:59:59.999Z'),
    };
    return await this.inspectorsService._createForTesting(inspectorDto);
  }

  async createProperty(name: string, customerId: number): Promise<Property> {
    const propertyDto: CreatePropertyDto = {
      customerId: customerId,
      title: name,
      description: 'Description for ' + name,
      street: 'Street ' + name,
      city: 'City ' + name,
      country: 'Country ' + name,
      zipCode: 'ZipCode ' + name,
    };
    return await this.propertiesService._createForTesting(propertyDto);
  }

  async createDevice(
    name: string,
    propertyId: number,
    deviceTypeId: number,
  ): Promise<Device> {
    const deviceDto: CreateDeviceDto = {
      propertyId: propertyId,
      deviceTypeId: deviceTypeId,
      title: name,
      description: 'Description for ' + name,
    };
    return await this.devicesService._createForTesting(deviceDto);
  }

  async createDeviceType(name: string): Promise<DeviceType> {
    const deviceTypeDto: CreateDeviceTypeDto = {
      title: name,
    };
    return await this.deviceTypesService._createForTesting(deviceTypeDto);
  }

  async createComponent(
    name: string,
    deviceId: number,
    componentTypeId: number,
  ): Promise<Component> {
    const componentDto: CreateComponentDto = {
      deviceId: deviceId,
      componentTypeId: componentTypeId,
      title: name,
      description: 'Description for ' + name,
    };
    return await this.componentsService._createForTesting(componentDto);
  }

  async createComponentType(name: string): Promise<ComponentType> {
    const componentTypeDto: CreateComponentTypeDto = {
      title: name,
    };
    return await this.componentTypesService._createForTesting(componentTypeDto);
  }

  async createInspection(
    name: string,
    deviceId: number,
    propertyId: number,
    inspectorId: number,
  ): Promise<Inspection> {
    const inspectionDto: CreateInspectionDto = {
      deviceId: deviceId,
      propertyId: propertyId,
      inspectorId: inspectorId,
      title: name,
      description: 'Description for ' + name,
    };
    return await this.inspectionsService._createForTesting(inspectionDto);
  }
}
