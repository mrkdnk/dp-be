import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SetupHelper } from '../../src/setup/helpers/setup.helper';
import {
  SetupApp,
  SetupData,
  TestingUser,
} from '../../src/setup/interfaces/setup.interfaces';
import { ResponseStatus } from '../../src/common/helpers/response-format.helper';
import { TestHelper } from '../../src/common/helpers/test.helper';
import { GetInspectionDto } from '../../src/inspections/dto/get-inspection.dto';
import { Inspection } from '../../src/inspections/entities/inspection.entity';
import { GetDeviceDto } from '../../src/devices/dto/get-device.dto';
import { Device } from '../../src/devices/entities/device.entity';
import { GetPropertyDto } from '../../src/properties/dto/get-property.dto';
import { Property } from '../../src/properties/entities/property.entity';
import { CreateInspectionDto } from '../../src/inspections/dto/create-inspection.dto';
import { isAfter, isDate, isSameSecond, parseISO } from 'date-fns';
import { Inspector } from '../../src/inspectors/entities/inspector.entity';
import { GetInspectorDto } from '../../src/inspectors/dto/get-inspector.dto';
import { UpdateInspectionDto } from '../../src/inspections/dto/update-inspection.dto';

describe('InspectionsController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const CUSTOMER_ENTITY_COUNT = 1;
  const PROPERTY_COUNT = 2;
  const DEVICE_COUNT = 5;
  const INSPECTION_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  // let technician: TestingUser;
  // let customer: TestingUser;
  let data: SetupData;
  const path: string = '/inspections';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'inspections',
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

    admin = testingApp.users.admin;
    // technician = testingApp.users.technician;
    // customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all inspections by Admin [GET /inspections]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(INSPECTION_COUNT);
        body.data.forEach((inspection: GetInspectionDto) => {
          TestHelper.testInspectionFormat(inspection);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Get All inspections by Technician [GET /inspections]');
  it.todo('Get All inspections by Customer [GET /inspections]');

  it('Gets single inspection by Admin [GET /inspections/:id]', () => {
    const inspection = TestHelper.getItemForTesting<
      Inspection | GetInspectionDto
    >(data.inspections, INSPECTION_COUNT, 0);

    return request(app.getHttpServer())
      .get(path + '/' + inspection.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(inspection.id);
        TestHelper.testExactInspectionResponse(body.data, inspection);
        expect(body.data.inspector.id).toBe(body.data.inspector.id);
        expect(body.data.propertyId).toBe(body.data.propertyId);
        expect(body.data.deviceId).toBe(body.data.deviceId);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Returns error when getting non existing inspection [GET /inspections/:id]', () => {
    return request(app.getHttpServer())
      .get(path + '/999999')
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it.todo(
    'Forbids to gets detail of inspection, that is not assigned to User [GET /inspections/:id]',
  );

  it('Creates a new device [POST /devices]', () => {
    const property = TestHelper.getItemForTesting<Property | GetPropertyDto>(
      data.properties,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT,
      0,
    );

    const device = TestHelper.getItemForTesting<Device | GetDeviceDto>(
      data.devices,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT * DEVICE_COUNT,
      0,
    );

    const inspector = TestHelper.getItemForTesting<Inspector | GetInspectorDto>(
      data.inspectors,
      TECHNICIAN_COUNT,
      0,
    );

    const createInspectionDto: CreateInspectionDto = {
      propertyId: property.id,
      deviceId: device.id,
      inspectorId: inspector.id,
      title: 'Inspection to create',
      description: 'This is description of the inspection to create',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createInspectionDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactDeviceResponse(body.data, createInspectionDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo(
    'Forbids to create a new inspection with missing data [POST /devices]',
  );

  it('Update a inspection [PATCH /inspections/:id]', async () => {
    const inspection = TestHelper.getItemForTesting<
      Inspection | GetInspectionDto
    >(data.inspections, INSPECTION_COUNT, 2);

    const updateInspectionDto: UpdateInspectionDto = {
      title: 'UPDATED-' + inspection.title,
      description: 'UPDATED-' + inspection.description,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + inspection.id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateInspectionDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(inspection.id);
        TestHelper.testExactInspectionResponse(body.data, updateInspectionDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(
          isSameSecond(parseISO(body.data.created), inspection.created),
        ).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(
          isAfter(parseISO(body.data.updated), inspection.updated),
        ).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Deletes a inspection - remove from DB [DELETE /inspections/:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Inspection | GetInspectionDto>(
      data.inspections,
      INSPECTION_COUNT,
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

  it.todo('Deletes a inspection - soft delete [DELETE /inspections/:id]');

  it.todo(
    'Forbids to delete a inspection not assigned with User [DELETE /inspection/:id]',
  );

  afterAll(async () => {
    await app.close();
  });
});
