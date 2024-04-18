import { formatISO } from 'date-fns';
import { GetPropertyDto } from '../dto/get-property.dto';
import { Property } from '../entities/property.entity';
import { mapCustomerToGetCustomerDto } from '../../customers/mappers/customer.mapper';

export const mapPropertyToGetPropertyDto = (
  property: Property,
): GetPropertyDto => {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    street: property.street,
    zipCode: property.zipCode,
    city: property.city,
    country: property.country,
    customer: property.customer
      ? mapCustomerToGetCustomerDto(property.customer)
      : undefined,
    created: formatISO(property.created),
    updated: formatISO(property.updated),
  };
};
