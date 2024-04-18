import { formatISO } from 'date-fns';
import { Component } from '../entities/component.entity';
import { GetComponentDto } from '../dto/get-component.dto';
import { mapDeviceToGetDeviceDto } from '../../devices/mappers/device.mapper';
import { mapComponentTypeToGetComponentTypeDto } from '../../component-types/mappers/component-type.mapper';

export const mapComponentToGetComponentDto = (
  component: Component,
): GetComponentDto => {
  return {
    id: component.id,
    title: component.title,
    description: component.description,
    device: mapDeviceToGetDeviceDto(component.device),
    componentType: mapComponentTypeToGetComponentTypeDto(
      component.componentType,
    ),
    created: formatISO(component.created),
    updated: formatISO(component.updated),
  };
};
