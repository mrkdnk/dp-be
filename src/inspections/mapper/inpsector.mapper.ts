import { formatISO } from 'date-fns';
import { mapPropertyToGetPropertyDto } from '../../properties/mapper/property.mapper';
import { Inspection } from '../entities/inspection.entity';
import { GetInspectionDto } from '../dto/get-inspection.dto';
import { mapDeviceToGetDeviceDto } from '../../devices/mappers/device.mapper';
import { mapInspectorToGetInspectorDto } from '../../inspectors/mappers/inspector.mapper';

export const mapInspectionToGetInspectionDto = (
  inspection: Inspection,
): GetInspectionDto => {
  return {
    id: inspection.id,
    title: inspection.title,
    description: inspection.description,
    property: mapPropertyToGetPropertyDto(inspection.property),
    device: mapDeviceToGetDeviceDto(inspection.device),
    inspector: mapInspectorToGetInspectorDto(inspection.inspector),
    created: formatISO(inspection.created),
    updated: formatISO(inspection.updated),
  };
};
