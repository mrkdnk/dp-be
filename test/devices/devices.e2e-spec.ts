import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  BASE_DEVICE_TYPE_COUNT,
  SetupHelper,
} from '../../src/setup/helpers/setup.helper';
import {
  SetupApp,
  SetupData,
  TestingUser,
} from '../../src/setup/interfaces/setup.interfaces';
import { ResponseStatus } from '../../src/common/helpers/response-format.helper';
import { TestHelper } from '../../src/common/helpers/test.helper';
import { isAfter, isDate, isSameSecond, parseISO } from 'date-fns';
import { GetPropertyDto } from '../../src/properties/dto/get-property.dto';
import { Property } from '../../src/properties/entities/property.entity';
import { GetDeviceDto } from '../../src/devices/dto/get-device.dto';
import { Device } from '../../src/devices/entities/device.entity';
import { CreateDeviceDto } from '../../src/devices/dto/create-device.dto';
import { DeviceType } from '../../src/device-types/entities/device-type.entity';
import { GetDeviceTypeDto } from '../../src/device-types/dto/get-device-type.dto';
import { UpdateDeviceDto } from '../../src/devices/dto/update-device.dto';

describe('DevicesController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const CUSTOMER_ENTITY_COUNT = 1;
  const PROPERTY_COUNT = 2;
  const DEVICE_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  // let technician: TestingUser;
  // let customer: TestingUser;
  let data: SetupData;
  const path: string = '/devices';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'devices',
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
    });

    admin = testingApp.users.admin;
    // technician = testingApp.users.technician;
    // customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all devices by Admin [GET /devices]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(
          CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
        );
        body.data.forEach((device: GetDeviceDto) => {
          TestHelper.testDeviceFormat(device);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Get All devices by Technician [GET /devices]');
  it.todo('Get All devices by Customer [GET /devices]');

  it('Gets single device by Admin [GET /devices/:id]', () => {
    const device = TestHelper.getItemForTesting<Device | GetDeviceDto>(
      data.devices,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + device.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(device.id);
        TestHelper.testExactDeviceResponse(body.data, device);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Returns error when getting non existing device [GET /devices/:id]', () => {
    return request(app.getHttpServer())
      .get(path + '/999999')
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it.todo('Gets components of the device [GET /devices/:id/components]');

  it.todo(
    'Forbids to gets detail of device, that is not assigned to Technician [GET /devices/:id]',
  );

  it.todo(
    'Forbids to gets detail of device, that is not assigned to Customer [GET /devices/:id]',
  );

  it('Creates a new device [POST /devices]', () => {
    const property = TestHelper.getItemForTesting<Property | GetPropertyDto>(
      data.properties,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT,
      0,
    );

    const deviceType = TestHelper.getItemForTesting<
      DeviceType | GetDeviceTypeDto
    >(data.deviceTypes, BASE_DEVICE_TYPE_COUNT, 0);

    const createDeviceDto: CreateDeviceDto = {
      propertyId: property.id,
      deviceTypeId: deviceType.id,
      title: 'Device to create',
      description: 'This is description of the device to create',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createDeviceDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactDeviceResponse(body.data, createDeviceDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to create a new device with missing data [POST /devices]');

  it('Update a device [PATCH /devices/:id]', async () => {
    const device = TestHelper.getItemForTesting<Device | GetDeviceDto>(
      data.devices,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
      2,
    );

    const updateDeviceDto: UpdateDeviceDto = {
      title: 'UPDATED-' + device.title,
      description: 'UPDATED-' + device.description,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + device.id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateDeviceDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(device.id);
        TestHelper.testExactDeviceResponse(body.data, updateDeviceDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(
          isSameSecond(parseISO(body.data.created), device.created),
        ).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(
          isAfter(parseISO(body.data.updated), device.updated),
        ).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Deletes a device - remove from DB [DELETE /:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Device | GetDeviceDto>(
      data.devices,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
      3,
    );

    // TODO: extract generic test for delete
    await request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    return request(app.getHttpServer())
      .get(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it.todo('Deletes a device - soft delete [DELETE /devices/:id]');

  it.todo(
    'Forbids to delete a device not assigned with User [DELETE /devices/:id]',
  );

  afterAll(async () => {
    await app.close();
  });
});
