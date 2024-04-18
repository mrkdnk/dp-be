import { formatISO } from 'date-fns';
import { Organization } from '../entities/organization.entity';
import { GetOrganizationDto } from '../dto/get-organization.dto';

export const mapOrganizationToGetOrganizationDto = (
  organization: Organization,
): GetOrganizationDto => {
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
