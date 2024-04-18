import { HttpException, HttpStatus } from '@nestjs/common';

export const EMAIL_ALREADY_EXISTS_MESSAGE = 'Email already exists';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(EMAIL_ALREADY_EXISTS_MESSAGE, HttpStatus.CONFLICT);
  }
}
