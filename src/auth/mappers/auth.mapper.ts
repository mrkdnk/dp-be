import { AuthUserDto } from '../dto/auth-user.dto';
import { User } from '../../users/entities/user.entity';

export const mapAuthToGetAuthDto = (user: User): AuthUserDto => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};
