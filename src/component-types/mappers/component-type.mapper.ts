import { GetComponentTypeDto } from '../dto/get-component-type.dto';
import { ComponentType } from '../entities/component-type.entity';
import { formatISO } from 'date-fns';

export const mapComponentTypeToGetComponentTypeDto = (
  componentType: ComponentType,
): GetComponentTypeDto => {
  return {
    id: componentType.id,
    title: componentType.title,
    created: formatISO(componentType.created),
    updated: formatISO(componentType.updated),
  };
};
