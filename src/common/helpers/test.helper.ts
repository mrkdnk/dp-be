import validator from 'validator';
import { Role } from '../../users/enums/role.enum';
import { SetupData } from '../../setup/interfaces/setup.interfaces';
import { GetUserDto } from '../../users/dto/get-user.dto';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { GetOrganizationDto } from '../../organizations/dto/get-organization.dto';
import { isSameSecond } from 'date-fns';

export class TestHelper {
  static testAuthUserResponse(body: any, data: any): void {
    expect(body.data.user.email).toBe(data.email);
    expect(body.data.user.role).toBe(data.role);
    expect(body.data.user.firstName).toBe(data.firstName);
    expect(body.data.user.lastName).toBe(data.lastName);
  }

  static testExactUserResponse(user: any, data: any): void {
    expect(user.email).toBe(data.email);
    expect(user.role).toBe(data.role);
    expect(user.firstName).toBe(data.firstName);
    expect(user.lastName).toBe(data.lastName);
  }

  static testUserFormat(user: any): void {
    expect(validator.isEmail(user.email)).toBeTruthy();
    expect(Object.values(Role)).toContain(user.role);
    expect(typeof user.firstName).toBe('string');
    expect(user.firstName.length).toBeGreaterThan(0);
    expect(typeof user.lastName).toBe('string');
    expect(user.lastName.length).toBeGreaterThan(0);
  }

  static getItemForTesting<T>(
    items: T[] | undefined,
    count: number,
    index: number,
  ): T {
    if (items === undefined) {
      // TODO: custom error
      throw new Error('Wrong Test Data');
    }
    expect(count).toBeGreaterThan(index);
    expect(items).toBeInstanceOf(Array);
    expect(items.length).toEqual(count);
    return items[index];
  }

  static getUserForTesting(
    data: SetupData,
    count: number,
    index: number,
  ): User | GetUserDto {
    return this.getItemForTesting<User | GetUserDto>(data.users, count, index);
  }

  static getOrganizationForTesting(
    data: SetupData,
    count: number,
    index: number,
  ): Organization | GetOrganizationDto {
    return this.getItemForTesting<Organization | GetOrganizationDto>(
      data.organizations,
      count,
      index,
    );
  }

  static testExactOrganizationResponse(organization: any, data: any): void {
    expect(organization.title).toBe(data.title);
    expect(organization.description).toBe(data.description);
    expect(organization.street).toBe(data.street);
    expect(organization.zipCode).toBe(data.zipCode);
    expect(organization.city).toBe(data.city);
    expect(organization.country).toBe(data.country);
    expect(organization.businessId).toBe(data.businessId);
    expect(organization.vatId).toBe(data.vatId);
  }

  static testOrganizationFormat(organization: any): void {
    expect(typeof organization.title).toBe('string');
    expect(typeof organization.description).toBe('string');
    expect(typeof organization.street).toBe('string');
    expect(typeof organization.zipCode).toBe('string');
    expect(typeof organization.city).toBe('string');
    expect(typeof organization.country).toBe('string');
    expect(typeof organization.businessId).toBe('string');
    expect(typeof organization.vatId).toBe('string');
  }

  static testExactCustomerResponse(customer: any, data: any): void {
    expect(customer.title).toBe(data.title);
    expect(customer.description).toBe(data.description);
    expect(customer.street).toBe(data.street);
    expect(customer.zipCode).toBe(data.zipCode);
    expect(customer.city).toBe(data.city);
    expect(customer.country).toBe(data.country);
    expect(customer.businessId).toBe(data.businessId);
    expect(customer.vatId).toBe(data.vatId);
  }

  static testCustomerFormat(customer: any): void {
    expect(typeof customer.title).toBe('string');
    expect(typeof customer.description).toBe('string');
    expect(typeof customer.street).toBe('string');
    expect(typeof customer.zipCode).toBe('string');
    expect(typeof customer.city).toBe('string');
    expect(typeof customer.country).toBe('string');
    expect(typeof customer.businessId).toBe('string');
    expect(typeof customer.vatId).toBe('string');
  }

  static testExactInspectorResponse(inspector: any, data: any): void {
    expect(inspector.licence).toBe(data.licence);
    expect(
      isSameSecond(inspector.licenceValidFrom, data.licenceValidFrom),
    ).toBeTruthy();
    expect(
      isSameSecond(inspector.licenceValidTo, data.licenceValidTo),
    ).toBeTruthy();
    expect(inspector.certificate).toBe(data.certificate);
    expect(
      isSameSecond(inspector.certificateValidFrom, data.certificateValidFrom),
    ).toBeTruthy();
    expect(
      isSameSecond(inspector.certificateValidTo, data.certificateValidTo),
    ).toBeTruthy();
  }

  static testInspectorFormat(inspector: any): void {
    expect(typeof inspector.licence).toBe('string');
    expect(inspector.licence.length).toBeGreaterThan(0);
    expect(typeof inspector.licenceValidFrom).toBe('string');
    expect(typeof inspector.licenceValidTo).toBe('string');
    expect(typeof inspector.certificate).toBe('string');
    expect(inspector.certificate.length).toBeGreaterThan(0);
    expect(typeof inspector.certificateValidFrom).toBe('string');
    expect(typeof inspector.certificateValidTo).toBe('string');
  }

  static testExactPropertyResponse(property: any, data: any): void {
    expect(property.title).toBe(data.title);
    expect(property.description).toBe(data.description);
    expect(property.street).toBe(data.street);
    expect(property.zipCode).toBe(data.zipCode);
    expect(property.city).toBe(data.city);
    expect(property.country).toBe(data.country);
  }

  static testPropertyFormat(property: any): void {
    expect(typeof property.title).toBe('string');
    expect(typeof property.description).toBe('string');
    expect(typeof property.street).toBe('string');
    expect(typeof property.zipCode).toBe('string');
    expect(typeof property.city).toBe('string');
    expect(typeof property.country).toBe('string');
  }

  static testExactDeviceResponse(device: any, data: any): void {
    expect(device.title).toBe(data.title);
    expect(device.description).toBe(data.description);
  }

  static testDeviceFormat(device: any): void {
    expect(typeof device.title).toBe('string');
    expect(typeof device.description).toBe('string');
  }

  static testExactComponentResponse(device: any, data: any): void {
    expect(device.title).toBe(data.title);
    expect(device.description).toBe(data.description);
  }

  static testComponentFormat(device: any): void {
    expect(typeof device.title).toBe('string');
    expect(typeof device.description).toBe('string');
  }

  static testExactInspectionResponse(device: any, data: any): void {
    expect(device.title).toBe(data.title);
    expect(device.description).toBe(data.description);
  }

  static testInspectionFormat(device: any): void {
    expect(typeof device.title).toBe('string');
    expect(typeof device.description).toBe('string');
  }
}
