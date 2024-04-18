import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerDto } from './dto/get-customer.dto';
import { mapCustomerToGetCustomerDto } from './mappers/customer.mapper';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
    const createdCustomer =
      await this.customerRepository.save(createCustomerDto);
    return mapCustomerToGetCustomerDto(createdCustomer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<GetCustomerDto> {
    const existingCustomer: Customer | null =
      await this.customerRepository.findOne({
        where: { id: id },
      });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    const customer = await this.customerRepository.preload({
      id: id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    const updatedCustomer = await this.customerRepository.save(customer);
    return mapCustomerToGetCustomerDto(updatedCustomer);
  }

  async findAll(): Promise<GetCustomerDto[]> {
    const customers: Customer[] = await this.customerRepository.find({});

    if (customers.length === 0) return [];

    return customers.map((customer) => mapCustomerToGetCustomerDto(customer));
  }

  async findOne(id: number): Promise<GetCustomerDto> {
    const customer: Customer = await this.customerRepository.findOneOrFail({
      where: { id },
    });
    return mapCustomerToGetCustomerDto(customer);
  }

  async delete(id: number): Promise<GetCustomerDto> {
    const customer = await this.customerRepository.findOneOrFail({
      where: { id: id },
    });
    const removedCustomer = await this.customerRepository.remove(customer);
    return mapCustomerToGetCustomerDto(removedCustomer);
  }

  async _createForTesting(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
    });

    return await this.customerRepository.save(customer);
  }
}
