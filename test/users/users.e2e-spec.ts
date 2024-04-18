import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  BASE_USER_COUNT,
  SetupHelper,
} from '../../src/setup/helpers/setup.helper';
import {
  SetupApp,
  SetupData,
  TestingUser,
} from '../../src/setup/interfaces/setup.interfaces';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { ResponseStatus } from '../../src/common/helpers/response-format.helper';
import { isDate, parseISO } from 'date-fns';
import { Role } from '../../src/users/enums/role.enum';
import { TestHelper } from '../../src/common/helpers/test.helper';
import { GetUserDto } from '../../src/users/dto/get-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { CreateInspectorDto } from '../../src/inspectors/dto/create-inspector.dto';

describe('UsersController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  let technician: TestingUser;
  let customer: TestingUser;
  let data: SetupData;
  const path: string = '/users';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'users',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
    });

    admin = testingApp.users.admin;
    technician = testingApp.users.technician;
    customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all users by Admin [GET /users]', () => {
    // TODO: only admin can get all users
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(
          BASE_USER_COUNT + ADMIN_COUNT + TECHNICIAN_COUNT + CUSTOMER_COUNT,
        );
        body.data.forEach((user: GetUserDto) => {
          TestHelper.testUserFormat(user);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Gets all users by Technician [GET /users]');
  it.todo('Gets all users by Customer [GET /users]');

  it('Gets single users by Admin [GET /users]', () => {
    const user = TestHelper.getUserForTesting(
      data,
      ADMIN_COUNT + TECHNICIAN_COUNT + CUSTOMER_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + user.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(user.id);
        TestHelper.testExactUserResponse(body.data, user);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Returns error when getting non existing User [GET /users]');
  it.todo(
    'Forbids to gets detail of user, that is assigned to Technician [GET /users]',
  );

  it('Creates a new user [POST /]', () => {
    // TODO: only admin can create a new user
    const createUserDto: CreateUserDto = {
      email: 'userToCreate@electroinspection.com',
      firstName: 'John',
      lastName: 'Admin',
      role: Role.ADMIN,
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactUserResponse(body.data, createUserDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Creates a new technician [POST /]', async () => {
    const createUserDto: CreateUserDto = {
      email: 'technicianToCreate@electroinspection.com',
      firstName: 'John',
      lastName: 'Technician',
      role: Role.TECHNICIAN,
    };
    const createdUserResponse = await request(app.getHttpServer())
      .post(path)
      .auth(admin.token, { type: 'bearer' })
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    const createdUser = createdUserResponse.body.data;
    console.log('===createdUser:', createdUser);

    expect(createdUser.id).toBeGreaterThan(0);
    TestHelper.testUserFormat(createdUser);

    const createInspectorDto: CreateInspectorDto = {
      userId: createdUser.id,
      licence: 'Licence ' + createdUser.firstName,
      licenceValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      licenceValidTo: new Date('2025-12-31T23:59:59.999Z'),
      certificate: 'Certificate ' + createdUser.firstName,
      certificateValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      certificateValidTo: new Date('2025-12-31T23:59:59.999Z'),
    };

    const createdInspectorResponse = await request(app.getHttpServer())
      .post(path + '/' + createdUser.id + '/inspectors')
      .auth(admin.token, { type: 'bearer' })
      .send(createInspectorDto)
      .expect(HttpStatus.CREATED);

    const createdInspector = createdInspectorResponse.body.data;

    expect(createdInspector.id).toBeGreaterThan(0);
    TestHelper.testExactInspectorResponse(createdInspector, createInspectorDto);

    return request(app.getHttpServer())
      .get(path + '/' + createdUser.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(createdUser.id);
        expect(body.data.inspector.id).toBe(createdInspector.id);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to create a new user with existing email [POST /]');

  it('Forbids to create a new user by technician [POST /]', () => {
    // TODO: only admin can create a new user
    const createUserDto: CreateUserDto = {
      email: 'userToCreateByTechnician@electroinspection.com',
      firstName: 'John',
      lastName: 'Technician',
      role: Role.TECHNICIAN,
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(technician.token, { type: 'bearer' })
      .send(createUserDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to create a new user by customer [POST /]', () => {
    // TODO: only admin can create a new user
    const createUserDto: CreateUserDto = {
      email: 'userToCreateByCustomer@electroinspection.com',
      firstName: 'John',
      lastName: 'Technician',
      role: Role.TECHNICIAN,
    };
    return request(app.getHttpServer())
      .post(path)
      .auth(customer.token, { type: 'bearer' })
      .send(createUserDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Updates a user [PATCH /:id]', async () => {
    const user = TestHelper.getUserForTesting(
      data,
      ADMIN_COUNT + TECHNICIAN_COUNT + CUSTOMER_COUNT,
      1,
    );

    const updateUserDto: UpdateUserDto = {
      email: 'UPDATED-' + user.email,
      firstName: 'UPDATED-' + user.firstName,
      lastName: 'UPDATED-' + user.lastName,
      role: Role.TECHNICIAN,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + user.id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateUserDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(user.id);
        TestHelper.testExactUserResponse(body.data, updateUserDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to update a user with another existing email [PATCH /:id]');
  it.todo('Forbids to update a user by customer [PATCH /:id]');
  it.todo('Forbids to update a user by technician [PATCH /:id]');

  it.todo('Activates a user [PATCH /:id/activate]');
  it.todo('Forbids to activate a user by customer [PATCH /:id/activate]');
  it.todo('Forbids to activate a user by technician [PATCH /:id/activate]');

  it.todo('Deactivates a user [PATCH /:id/deactivate]');
  it.todo('Forbids to deactivate a user by customer [PATCH /:id/deactivate]');
  it.todo('Forbids to deactivate a user by technician [PATCH /:id/deactivate]');

  it('Deletes a user - remove from DB [DELETE /:id]', async () => {
    const user = TestHelper.getUserForTesting(
      data,
      ADMIN_COUNT + TECHNICIAN_COUNT + CUSTOMER_COUNT,
      3,
    );
    await request(app.getHttpServer())
      .delete(path + '/' + user.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    return request(app.getHttpServer())
      .get(path + '/' + user.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it.todo('Deletes a user - soft delete [DELETE /:id]');
  it.todo('Forbids to delete a user by customer [DELETE /:id]');
  it.todo('Forbids to delete a user by technician [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
