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
import { GetOrganizationDto } from '../../src/organizations/dto/get-organization.dto';
import { CreateOrganizationDto } from '../../src/organizations/dto/create-organization.dto';
import { isAfter, isDate, isSameSecond, parseISO } from 'date-fns';
import { UpdateOrganizationDto } from '../../src/organizations/dto/update-organization.dto';

describe('OrganizationsController (e2e)', () => {
  const ADMIN_COUNT = 5;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 5;
  const ORGANIZATION_COUNT = 5;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  let technician: TestingUser;
  let customer: TestingUser;
  let data: SetupData;
  const path: string = '/organizations';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'organizations',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
      organizations: {
        count: ORGANIZATION_COUNT,
      },
    });

    admin = testingApp.users.admin;
    technician = testingApp.users.technician;
    customer = testingApp.users.customer;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Gets all organization by Admin [GET /organizations]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.length).toBe(ORGANIZATION_COUNT);
        body.data.forEach((organization: GetOrganizationDto) => {
          TestHelper.testOrganizationFormat(organization);
        });
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Forbids to get all organizations by Technician [GET /organization]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(technician.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to get all organizations by Customer [GET /organization]', () => {
    return request(app.getHttpServer())
      .get(path)
      .auth(customer.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Gets single organization by Admin [GET /organizations]', () => {
    const organization = TestHelper.getOrganizationForTesting(
      data,
      ORGANIZATION_COUNT,
      0,
    );

    return request(app.getHttpServer())
      .get(path + '/' + organization.id)
      .auth(admin.token, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(organization.id);
        TestHelper.testExactOrganizationResponse(body.data, organization);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });
  //
  // it.todo('Returns error when getting non existing User [GET /users]');
  // it.todo(
  //   'Forbids to gets detail of user, that is assigned to Technician [GET /users]',
  // );
  //
  it('Creates a new Organization [POST /]', () => {
    const createOrganizationDto: CreateOrganizationDto = {
      title: 'Organization to create',
      description: 'This is description of the organization to create',
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
      .send(createOrganizationDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data.id).toBeGreaterThan(0);
        TestHelper.testExactOrganizationResponse(
          body.data,
          createOrganizationDto,
        );
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to create a new organization with missing data [POST /]');

  it('Forbids to create a new organization by technician [POST /]', () => {
    const createOrganizationDto: CreateOrganizationDto = {
      title: 'Organization to create by technician',
      description: 'This is description of the organization to create',
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
      .send(createOrganizationDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to create a new organization by customer [POST /]', () => {
    const createOrganizationDto: CreateOrganizationDto = {
      title: 'Organization to create by technician',
      description: 'This is description of the organization to create',
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
      .send(createOrganizationDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Update an organization [PATCH /:id]', async () => {
    const { id, created, updated, ...organization } =
      TestHelper.getOrganizationForTesting(data, ORGANIZATION_COUNT, 2);

    const updateOrganizationDto: UpdateOrganizationDto = {
      ...organization,
      title: 'UPDATED-' + organization.title,
      description: 'UPDATED-' + organization.description,
      street: 'UPDATED-' + organization.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateOrganizationDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(id);
        TestHelper.testExactOrganizationResponse(
          body.data,
          updateOrganizationDto,
        );
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isSameSecond(parseISO(body.data.created), created)).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(isAfter(parseISO(body.data.updated), updated)).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it('Forbids to update an organization by technician [PATCH /:id]', () => {
    const { id, created, updated, ...organization } =
      TestHelper.getOrganizationForTesting(data, ORGANIZATION_COUNT, 2);

    const updateOrganizationDto: UpdateOrganizationDto = {
      ...organization,
      title: 'UPDATED by technician' + organization.title + updated,
      description: 'UPDATED-' + organization.description + created,
      street: 'UPDATED-' + organization.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(technician.token, { type: 'bearer' })
      .send(updateOrganizationDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to update an organization by customer [PATCH /:id]', () => {
    const { id, created, updated, ...organization } =
      TestHelper.getOrganizationForTesting(data, ORGANIZATION_COUNT, 2);

    const updateOrganizationDto: UpdateOrganizationDto = {
      ...organization,
      title: 'UPDATED by customer' + organization.title + updated,
      description: 'UPDATED-' + organization.description + created,
      street: 'UPDATED-' + organization.street,
    };
    return request(app.getHttpServer())
      .patch(path + '/' + id)
      .auth(customer.token, { type: 'bearer' })
      .send(updateOrganizationDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Deletes an organization - remove from DB [DELETE /:id]', async () => {
    const { id } = TestHelper.getOrganizationForTesting(
      data,
      ORGANIZATION_COUNT,
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
  it.todo('Deletes an organization - soft delete [DELETE /:id]');

  it('Forbids to delete an organization by customer [DELETE /:id]', async () => {
    const { id } = TestHelper.getOrganizationForTesting(
      data,
      ORGANIZATION_COUNT,
      4,
    );
    return request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(customer.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('Forbids to delete an organization by technician [DELETE /:id]', async () => {
    const { id } = TestHelper.getOrganizationForTesting(
      data,
      ORGANIZATION_COUNT,
      4,
    );
    return request(app.getHttpServer())
      .delete(path + '/' + id)
      .auth(technician.token, { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});
