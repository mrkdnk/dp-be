import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SetupHelper } from '../../src/setup/helpers/setup.helper';
import {
  SetupApp,
  TestingUser,
} from '../../src/setup/interfaces/setup.interfaces';
import { ResponseStatus } from '../../src/common/helpers/response-format.helper';
import { TestHelper } from '../../src/common/helpers/test.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testHelper: SetupHelper;
  let admin: TestingUser;
  const path: string = '';

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const testingApp: SetupApp = await testHelper.createSetupApp({
      testName: 'auth',
    });

    admin = testingApp.users.admin;

    app = testingApp.app;
  });

  it('Request magic code as a valid user [POST /login]', () => {
    const userData = {
      email: admin.user.email,
    };

    return request(app.getHttpServer())
      .post(path + '/auth/magic-code')
      .send(userData)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.magicCode).toBeDefined();
        expect(typeof body.data.magicCode).toBe('string');
        expect(body.data.magicCode.length).toBe(6);
        expect(body.status).toBe(ResponseStatus.SUCCESS);
        TestHelper.testAuthUserResponse(body, admin.user);
      });
  });

  it.todo('Returns no magic code to inactive user [POST /login]');
  it.todo('Returns no magic code to deleted user [POST /login]');

  it('Login as a valid user [POST /login]', async () => {
    const userData = {
      email: admin.user.email,
    };

    const magicCodeRequest = await request(app.getHttpServer())
      .post(path + '/auth/magic-code')
      .send(userData)
      .expect(HttpStatus.OK);

    expect(magicCodeRequest.body.data.magicCode).toBeDefined();

    const loginData = {
      email: admin.user.email,
      code: magicCodeRequest.body.data.magicCode,
    };

    return request(app.getHttpServer())
      .post(path + '/auth/login')
      .send(loginData)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.data.access_token).toBeDefined();
        expect(typeof body.data.access_token).toBe('string');
        expect(body.data.access_token).not.toBe('');
        expect(body.status).toBe(ResponseStatus.SUCCESS);
        TestHelper.testAuthUserResponse(body, admin.user);
      });
  });

  it('Forbids to login with no magic code [POST /login]', async () => {
    const loginData = {
      email: admin.user.email,
    };

    return request(app.getHttpServer())
      .post(path + '/auth/login')
      .send(loginData)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.status).toBe(ResponseStatus.FAIL);
      });
  });
  it('Forbids to login with wrong magic code [POST /login]', async () => {
    const loginData = {
      email: admin.user.email,
      code: '000000',
    };

    return request(app.getHttpServer())
      .post(path + '/auth/login')
      .send(loginData)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(({ body }) => {
        expect(body.status).toBe(ResponseStatus.ERROR);
      });
  });

  it.todo('Forbids to login with expired magic code [POST /login]');
  it.todo('Forbids to login with used magic code [POST /login]');
  it.todo('Forbids to login to inactive user [POST /login]');
  it.todo('Forbids to login to deleted user [POST /login]');

  afterAll(async () => {
    await app.close();
  });
});
