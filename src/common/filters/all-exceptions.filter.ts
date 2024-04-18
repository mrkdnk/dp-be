import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import * as dotenv from 'dotenv';
import { ResponseStatus } from '../helpers/response-format.helper';
dotenv.config();

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  // TODO: log all error
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // TODO: use these, when no relevant error is returned. standardize in the future
    if (process.env.EXCEPTION_DEBUG != 'true') {
      console.log('>> exception', exception);
      console.log('>> exception type', typeof exception);
    }

    // TODO: refactor whole file
    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        // TODO: fail should be constant
        status: ResponseStatus.FAIL,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception instanceof NotFoundException
          ? exception.message
          : exception.getResponse()
        : null;

    // TODO: match fail vs error like https://github.com/omniti-labs/jsend

    if (status == HttpStatus.BAD_REQUEST) {
      const exceptionResponse: any =
        exception instanceof HttpException ? exception.getResponse() : {};
      console.log('===BAD_REQUEST', exceptionResponse.message);
      return response.status(status).json({
        status: ResponseStatus.FAIL,
        message: exceptionResponse.error,
        data: exceptionResponse.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (status == HttpStatus.CONFLICT) {
      return response.status(status).json({
        status: ResponseStatus.FAIL,
        // todo: it should have body with issues
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (status == HttpStatus.FORBIDDEN) {
      return response.status(status).json({
        status: ResponseStatus.FAIL,
        // todo: it should have body with issues
        message: 'Forbidden resource',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    response.status(status).json({
      status: ResponseStatus.ERROR,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
