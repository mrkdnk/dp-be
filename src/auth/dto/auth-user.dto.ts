import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class AuthUserDto {
  @ApiProperty({ description: 'ID a user.', example: '42' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The first name of a user.', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of a user.', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email name of a user.',
    example: 'john.doe@electroinspection.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Role of a user.', example: Role.TECHNICIAN })
  @IsString()
  role: Role;
}
