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
import { isAfter, isDate, isSameSecond, parseISO } from 'date-fns';
import { GetPropertyDto } from '../../src/properties/dto/get-property.dto';
import { Property } from '../../src/properties/entities/property.entity';
import { CreatePropertyDto } from '../../src/properties/dto/create-property.dto';
import { Customer } from '../../src/customers/entities/customer.entity';
import { GetCustomerDto } from '../../src/customers/dto/get-customer.dto';
import { UpdatePropertyDto } from '../../src/properties/dto/update-property.dto';

describe('PropertiesController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const CUSTOMER_ENTITY_COUNT = 2;
  const PROPERTY_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  // let technician: TestingUser;
  // let customer: TestingUser;
  let data: SetupData;
  const path: string = '/properties';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'properties',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
      customers: {
        count: CUSTOMER_ENTITY_COUNT,
        properties: {
          count: PROPERTY_COUNT,
        },
      },
    });

    admin = testingApp.users.admin;
    // technician = testingApp.users.technician;
    // customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all properties by Admin [GET /properties]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT);
        body.data.forEach((property: GetPropertyDto) => {
          TestHelper.testPropertyFormat(property);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Get All properties by Technician [GET /properties]');
  it.todo('Get All properties by Technician [GET /properties]');

  it('Gets single property by Admin [GET /properties/:id]', () => {
    const property = TestHelper.getItemForTesting<Property | GetPropertyDto>(
      data.properties,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + property.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(property.id);
        TestHelper.testExactOrganizationResponse(body.data, property);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Returns error when getting non existing Property [GET /properties/:id]', () => {
    return request(app.getHttpServer())
      .get(path + '/999999')
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it.todo(
    'Forbids to gets detail of property, that is not assigned to Technician [GET /properties/:id]',
  );

  it('Creates a new Property [POST /properties]', () => {
    const customer = TestHelper.getItemForTesting<Customer | GetCustomerDto>(
      data.customers,
      CUSTOMER_ENTITY_COUNT,
      0,
    );

    const createPropertyDto: CreatePropertyDto = {
      customerId: customer.id,
      title: 'Property to create',
      description: 'This is description of the property to create',
      street: 'Winterova 12',
      zipCode: '12345',
      city: 'Piestany',
      country: 'Slovakia',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createPropertyDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactPropertyResponse(body.data, createPropertyDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to create a new property with missing data [POST /]');

  it('Update a property [PATCH /properties/:id]', async () => {
    const { id, created, updated, ...property } = TestHelper.getItemForTesting<
      Property | GetPropertyDto
    >(data.properties, CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT, 2);

    const updatePropertyDto: UpdatePropertyDto = {
      ...property,
      title: 'UPDATED-' + property.title,
      description: 'UPDATED-' + property.description,
      street: 'UPDATED-' + property.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .send(updatePropertyDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(id);
        TestHelper.testExactPropertyResponse(body.data, updatePropertyDto);
        // TODO: extract test if updated is after created and created is the same
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isSameSecond(parseISO(body.data.created), created)).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(isAfter(parseISO(body.data.updated), updated)).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Deletes a property - remove from DB [DELETE /:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Property | GetPropertyDto>(
      data.properties,
      CUSTOMER_ENTITY_COUNT * PROPERTY_COUNT,
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
  it.todo('Deletes a property - soft delete [DELETE /properties/:id]');

  it.todo(
    'Forbids to delete a property not assigned with User [DELETE /properties/:id]',
  );

  it.todo('Get all devices of a property  [GET /properties/:id/devices]');

  afterAll(async () => {
    await app.close();
  });
});
