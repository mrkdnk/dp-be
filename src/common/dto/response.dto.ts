import { IsObject, IsString } from 'class-validator';

export class ResponseDto<T> {
  // @ApiProperty({ description: 'Response status'})
  @IsString()
  readonly status: string;

  // @ApiProperty({ description: 'Response data'})
  @IsObject()
  readonly data: T;
}
