import { formatISO } from 'date-fns';
import { GetDeviceDto } from '../dto/get-device.dto';
import { Device } from '../entities/device.entity';
import { mapPropertyToGetPropertyDto } from '../../properties/mapper/property.mapper';
import { mapDeviceTypeToGetDeviceTypeDto } from '../../device-types/mappers/device-type.mapper';

export const mapDeviceToGetDeviceDto = (device: Device): GetDeviceDto => {
  return {
    id: device.id,
    title: device.title,
    description: device.description,
    property: mapPropertyToGetPropertyDto(device.property),
    deviceType: mapDeviceTypeToGetDeviceTypeDto(device.deviceType),
    created: formatISO(device.created),
    updated: formatISO(device.updated),
  };
};
