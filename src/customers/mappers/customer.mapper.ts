import { formatISO } from 'date-fns';
import { Customer } from '../entities/customer.entity';
import { GetCustomerDto } from '../dto/get-customer.dto';

export const mapCustomerToGetCustomerDto = (
  organization: Customer,
): GetCustomerDto => {
  return {
    id: organization.id,
    title: organization.title,
    description: organization.description,
    street: organization.street,
    zipCode: organization.zipCode,
    city: organization.city,
    country: organization.country,
    businessId: organization.businessId,
    vatId: organization.vatId,
    created: formatISO(organization.created),
    updated: formatISO(organization.updated),
  };
};
