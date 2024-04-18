import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../enums/role.enum';
import { MagicCode } from '../../auth/entities/magic-code.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../customers/entities/customer.entity';
import { Inspector } from '../../inspectors/entities/inspector.entity';

export const USER_REMOVED: string = 'User was removed';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.TECHNICIAN })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => MagicCode, (magicCode) => magicCode.user, { eager: false })
  magicCodes: MagicCode[];

  @ApiProperty()
  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.technicians, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @ApiProperty()
  @Column({ nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  customer: Customer;

  @ApiProperty()
  @Column({ nullable: true })
  inspectorId: number;

  @OneToOne(() => Inspector, (inspector: Inspector) => inspector.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'inspectorId' })
  inspector: Inspector;
}
