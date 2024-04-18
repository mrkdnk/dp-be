import { formatISO } from 'date-fns';
import { Inspector } from '../entities/inspector.entity';
import { GetInspectorDto } from '../dto/get-inspector.dto';

export const mapInspectorToGetInspectorDto = (
  inspector: Inspector,
): GetInspectorDto => {
  return {
    id: inspector.id,
    licence: inspector.licence,
    licenceValidFrom: inspector.licenceValidFrom,
    licenceValidTo: inspector.licenceValidTo,
    certificate: inspector.certificate,
    certificateValidFrom: inspector.certificateValidFrom,
    certificateValidTo: inspector.certificateValidTo,
    created: formatISO(inspector.created),
    updated: formatISO(inspector.updated),
  };
};
