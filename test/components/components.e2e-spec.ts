import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  BASE_COMPONENT_TYPE_COUNT,
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
import { GetDeviceDto } from '../../src/devices/dto/get-device.dto';
import { Device } from '../../src/devices/entities/device.entity';
import { Component } from '../../src/components/entities/component.entity';
import { GetComponentDto } from '../../src/components/dto/get-component.dto';
import { GetComponentTypeDto } from '../../src/component-types/dto/get-component-type.dto';
import { ComponentType } from '../../src/component-types/entities/component-type.entity';
import { CreateComponentDto } from '../../src/components/dto/create-component.dto';
import { UpdateComponentDto } from '../../src/components/dto/update-component.dto';

describe('ComponentsController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const CUSTOMER_ENTITY_COUNT = 1;
  const PROPERTY_COUNT = 2;
  const DEVICE_COUNT = 5;
  const COMPONENT_COUNT = 15;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  // let technician: TestingUser;
  // let customer: TestingUser;
  let data: SetupData;
  const path: string = '/components';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'components',
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
            components: {
              count: COMPONENT_COUNT,
            },
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

  it('Gets single component by Admin [GET /components/:id]', () => {
    const component = TestHelper.getItemForTesting<Component | GetComponentDto>(
      data.components,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT * COMPONENT_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + component.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(component.id);
        TestHelper.testExactDeviceResponse(body.data, component);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Returns error when getting non existing component [GET /components/:id]', () => {
    return request(app.getHttpServer())
      .get(path + '/999999')
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it.todo(
    'Forbids to gets detail of component, that is not assigned to Technician [GET /components/:id]',
  );

  it.todo(
    'Forbids to gets detail of component, that is not assigned to Customer [GET /components/:id]',
  );

  it('Creates a new component [POST /components]', () => {
    const device = TestHelper.getItemForTesting<Device | GetDeviceDto>(
      data.devices,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
      0,
    );

    const componentType = TestHelper.getItemForTesting<
      ComponentType | GetComponentTypeDto
    >(data.componentTypes, BASE_COMPONENT_TYPE_COUNT, 0);

    const createComponentDto: CreateComponentDto = {
      deviceId: device.id,
      componentTypeId: componentType.id,
      title: 'Component to create',
      description: 'This is description of the component to create',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createComponentDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactComponentResponse(body.data, createComponentDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo(
    'Forbids to create a new component with missing data [POST /components]',
  );

  it('Update a device [PATCH /component/:id]', async () => {
    const component = TestHelper.getItemForTesting<Component | GetComponentDto>(
      data.components,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT * COMPONENT_COUNT,
      2,
    );

    const updateComponentDto: UpdateComponentDto = {
      title: 'UPDATED-' + component.title,
      description: 'UPDATED-' + component.description,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + component.id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateComponentDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(component.id);
        TestHelper.testExactComponentResponse(body.data, updateComponentDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(
          isSameSecond(parseISO(body.data.created), component.created),
        ).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(
          isAfter(parseISO(body.data.updated), component.updated),
        ).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Deletes a component - remove from DB [DELETE /components/:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Component | GetComponentDto>(
      data.components,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT * COMPONENT_COUNT,
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

  it.todo('Deletes a component - soft delete [DELETE /components/:id]');

  it.todo(
    'Forbids to delete a component not assigned with User [DELETE /components/:id]',
  );

  afterAll(async () => {
    await app.close();
  });
});
