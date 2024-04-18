import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EmailAlreadyExistsException } from '../common/exceptions/email-already-exists.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { mapUserToGetUserDto } from './mappers/user.mapper';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createForTesting(createUserDto: CreateUserDto): Promise<User> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const user = this.userRepository.create({
      ...createUserDto,
    });

    return await this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const user = this.userRepository.create({
      ...createUserDto,
    });

    const savedUser = await this.userRepository.save(user);
    return mapUserToGetUserDto(savedUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updatedUser = await this.userRepository.save(user);
    return mapUserToGetUserDto(updatedUser);
  }

  async findAll(loggedInUser: User): Promise<GetUserDto[]> {
    // TODO: Implement this method
    console.log('loggedInUser', loggedInUser);

    const users: User[] = await this.userRepository.find({});

    if (users.length === 0) return [];

    return users.map((user) => mapUserToGetUserDto(user));
  }

  async findOne(id: number, loggedInUser: User): Promise<GetUserDto> {
    // TODO: Implement this method
    console.log('loggedInUser', loggedInUser);

    const user: User = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['inspector'],
    });
    return mapUserToGetUserDto(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { email },
      select: ['email', 'id', 'firstName', 'lastName', 'role'],
    });
  }

  async findOneWithInspector(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['inspector'],
    });
  }

  async delete(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOneOrFail({ where: { id: id } });
    const removedUser = await this.userRepository.remove(user);
    return mapUserToGetUserDto(removedUser);
  }

  async _countAll(): Promise<number> {
    const users: User[] = await this.userRepository.find({});
    return users.length;
  }
}
