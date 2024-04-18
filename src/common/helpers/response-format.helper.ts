import { ResponseDto } from '../dto/response.dto';

export const ResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAIL: 'fail',
};

export class ResponseFormatHelper {
  static format<T>(data: T): ResponseDto<T> {
    return {
      status: 'success',
      data: data,
    };
  }

  static formatObject(data: any): ResponseDto<any> {
    return {
      status: 'success',
      data: data,
    };
  }
}
