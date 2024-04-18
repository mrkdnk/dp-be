import { GetDeviceTypeDto } from '../dto/get-device-type.dto';
import { DeviceType } from '../entities/device-type.entity';
import { formatISO } from 'date-fns';

export const mapDeviceTypeToGetDeviceTypeDto = (
  deviceType: DeviceType,
): GetDeviceTypeDto => {
  return {
    id: deviceType.id,
    title: deviceType.title,
    created: formatISO(deviceType.created),
    updated: formatISO(deviceType.updated),
  };
};
