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
import { GetCustomerDto } from '../../src/customers/dto/get-customer.dto';
import { Customer } from '../../src/customers/entities/customer.entity';
import { CreateCustomerDto } from '../../src/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../src/customers/dto/update-customer.dto';

describe('CustomersController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const CUSTOMER_ENTITY_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  let technician: TestingUser;
  let customer: TestingUser;
  let data: SetupData;
  const path: string = '/customers';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'customers',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
      customers: {
        count: CUSTOMER_ENTITY_COUNT,
      },
    });

    admin = testingApp.users.admin;
    technician = testingApp.users.technician;
    customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all customer by Admin [GET /customers]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(CUSTOMER_COUNT);
        body.data.forEach((customer: GetCustomerDto) => {
          TestHelper.testCustomerFormat(customer);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Forbids to get all customers by Technician [GET /customer]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(technician.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to get all customers by Customer [GET /customer]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(customer.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Gets single customer by Admin [GET /customers]', () => {
    const customer = TestHelper.getItemForTesting<Customer | GetCustomerDto>(
      data.customers,
      CUSTOMER_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + customer.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(customer.id);
        TestHelper.testExactCustomerResponse(body.data, customer);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Returns error when getting non existing Customer [GET /customers]');

  it('Creates a new Customer [POST /]', () => {
    const createCustomerDto: CreateCustomerDto = {
      title: 'Customer to create',
      description: 'This is description of the customer to create',
      street: 'Winterova 12',
      zipCode: '12345',
      city: 'Piestany',
      country: 'Slovakia',
      businessId: '123456789',
      vatId: 'SK123456789',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createCustomerDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactCustomerResponse(body.data, createCustomerDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to create a new customer with missing data [POST /]');

  it('Forbids to create a new customer by technician [POST /]', () => {
    const createCustomerDto: CreateCustomerDto = {
      title: 'Customer to create by technician',
      description: 'This is description of the customer to create',
      street: 'Winterova 12',
      zipCode: '12345',
      city: 'Piestany',
      country: 'Slovakia',
      businessId: '123456789',
      vatId: 'SK123456789',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(technician.token, { type: 'bearer' })
      .send(createCustomerDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to create a new customer by customer [POST /]', () => {
    const createCustomerDto: CreateCustomerDto = {
      title: 'Customer to create by technician',
      description: 'This is description of the customer to create',
      street: 'Winterova 12',
      zipCode: '12345',
      city: 'Piestany',
      country: 'Slovakia',
      businessId: '123456789',
      vatId: 'SK123456789',
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(customer.token, { type: 'bearer' })
      .send(createCustomerDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Update an customer [PATCH /:id]', async () => {
    const { id, created, updated, ...customer } = TestHelper.getItemForTesting<
      Customer | GetCustomerDto
    >(data.customers, CUSTOMER_COUNT, 1);

    const updateCustomerDto: UpdateCustomerDto = {
      ...customer,
      title: 'UPDATED-' + customer.title,
      description: 'UPDATED-' + customer.description,
      street: 'UPDATED-' + customer.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateCustomerDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(id);
        TestHelper.testExactCustomerResponse(body.data, updateCustomerDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isSameSecond(parseISO(body.data.created), created)).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(isAfter(parseISO(body.data.updated), updated)).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Forbids to update an customer by technician [PATCH /:id]', () => {
    const { id, created, updated, ...customer } = TestHelper.getItemForTesting<
      Customer | GetCustomerDto
    >(data.customers, CUSTOMER_COUNT, 1);

    const updateCustomerDto: UpdateCustomerDto = {
      ...customer,
      title: 'UPDATED by technician' + customer.title + updated,
      description: 'UPDATED-' + customer.description + created,
      street: 'UPDATED-' + customer.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(technician.token, { type: 'bearer' })
      .send(updateCustomerDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to update an customer by customer [PATCH /:id]', () => {
    const { id, created, updated, ...customerToUpdate } =
      TestHelper.getItemForTesting<Customer | GetCustomerDto>(
        data.customers,
        CUSTOMER_COUNT,
        1,
      );

    const updateCustomerDto: UpdateCustomerDto = {
      ...customer,
      title: 'UPDATED by customer' + customerToUpdate.title + updated,
      description: 'UPDATED-' + customerToUpdate.description + created,
      street: 'UPDATED-' + customerToUpdate.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(customer.token, { type: 'bearer' })
      .send(updateCustomerDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Deletes an customer - remove from DB [DELETE /:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Customer | GetCustomerDto>(
      data.customers,
      CUSTOMER_COUNT,
      3,
    );
    await request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    return request(app.getHttpServer())
      .get(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it.todo('Deletes an customer - soft delete [DELETE /:id]');

  it('Forbids to delete an customer by customer [DELETE /:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Customer | GetCustomerDto>(
      data.customers,
      CUSTOMER_COUNT,
      4,
    );
    return request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(customer.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to delete an customer by technician [DELETE /:id]', async () => {
    const { id } = TestHelper.getItemForTesting<Customer | GetCustomerDto>(
      data.customers,
      CUSTOMER_COUNT,
      4,
    );
    return request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(technician.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it.todo('Returns properties of Customer [GET /customers/:id/properties]');
  it.todo('Returns users of Customer [GET /customers/:id/users]');

  afterAll(async () => {
    await app.close();
  });
});
