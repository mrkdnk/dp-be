import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseFormatHelper } from '../common/helpers/response-format.helper';
import { GetCustomerDto } from './dto/get-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CUSTOMER_REMOVED } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ResponseDto<GetCustomerDto[]>> {
    const customer: GetCustomerDto[] = await this.customersService.findAll();
    return ResponseFormatHelper.format<GetCustomerDto[]>(customer);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<GetCustomerDto>> {
    const customer: GetCustomerDto = await this.customersService.findOne(id);
    return ResponseFormatHelper.format<GetCustomerDto>(customer);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ResponseDto<GetCustomerDto>> {
    const createdCustomer: GetCustomerDto =
      await this.customersService.create(createCustomerDto);
    return ResponseFormatHelper.format<GetCustomerDto>(createdCustomer);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ResponseDto<GetCustomerDto>> {
    const updatedCustomer: GetCustomerDto = await this.customersService.update(
      id,
      updateCustomerDto,
    );
    return ResponseFormatHelper.format<GetCustomerDto>(updatedCustomer);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<string>> {
    await this.customersService.delete(id);
    return ResponseFormatHelper.format<string>(CUSTOMER_REMOVED);
  }
}
