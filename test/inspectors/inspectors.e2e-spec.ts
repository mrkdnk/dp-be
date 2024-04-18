import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SetupHelper } from '../../src/setup/helpers/setup.helper';
import {
  SetupApp,
  SetupData,
  TestingUser,
} from '../../src/setup/interfaces/setup.interfaces';
import { ResponseStatus } from '../../src/common/helpers/response-format.helper';
import { isDate, parseISO } from 'date-fns';
import { Role } from '../../src/users/enums/role.enum';
import { TestHelper } from '../../src/common/helpers/test.helper';
import { UpdateInspectorDto } from '../../src/inspectors/dto/update-inspector.dto';

describe('InspectorsController (e2e)', () => {
  const ADMIN_COUNT = 0;
  const TECHNICIAN_COUNT = 5;
  const CUSTOMER_COUNT = 0;

  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  let data: SetupData;
  const path: string = '/inspectors';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'inspectors',
      users: {
        admin: ADMIN_COUNT,
        technician: TECHNICIAN_COUNT,
        customer: CUSTOMER_COUNT,
      },
    });

    admin = testingApp.users.admin;
    data = testingApp.data;

    app = testingApp.app;
  });

  it('Update an inspector [PATCH /:id]', async () => {
    const user = TestHelper.getUserForTesting(
      data,
      ADMIN_COUNT + TECHNICIAN_COUNT + CUSTOMER_COUNT,
      1,
    );
    expect(user.role).toBe(Role.TECHNICIAN);
    expect(user.inspector).toBeDefined();

    const updateUserDto: UpdateInspectorDto = {
      licence: 'UPDATED',
      licenceValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      licenceValidTo: new Date('2025-12-31T23:59:59.999Z'),
      certificate: 'UPDATED',
      certificateValidFrom: new Date('2022-12-31T23:59:59.999Z'),
      certificateValidTo: new Date('2025-12-31T23:59:59.999Z'),
    };
    return request(app.getHttpServer())
      .patch(path + '/' + user.inspector?.id)
      .auth(admin.token, { type: 'bearer' })
      .send(updateUserDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.id).toBe(user.inspector?.id);
        TestHelper.testExactUserResponse(body.data, updateUserDto);
        expect(isDate(parseISO(body.data.created))).toBeTruthy();
        expect(isDate(parseISO(body.data.updated))).toBeTruthy();
        expect(body.status).toBe(ResponseStatus.SUCCESS);
      });
  });

  it.todo('Forbids to update an inspector by customer [PATCH /inspectors/:id]');
  it.todo('Forbids to update an inspector by technician [PATCH /:id]');

  afterAll(async () => {
    await app.close();
  });
});
