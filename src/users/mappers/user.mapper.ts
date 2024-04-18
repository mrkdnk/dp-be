import { GetUserDto } from '../dto/get-user.dto';
import { User } from '../entities/user.entity';
import { formatISO } from 'date-fns';
import { mapInspectorToGetInspectorDto } from '../../inspectors/mappers/inspector.mapper';

export const mapUserToGetUserDto = (user: User): GetUserDto => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    inspector: user.inspector
      ? mapInspectorToGetInspectorDto(user.inspector)
      : undefined,
    created: formatISO(user.created),
    updated: formatISO(user.updated),
  };
};
