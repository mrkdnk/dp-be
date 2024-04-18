import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';

export const CUSTOMER_REMOVED: string = 'Customer was removed';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  street: string;

  @Column()
  zipCode: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  businessId: string;

  @Column({ nullable: true })
  vatId: string;

  @OneToMany(() => User, (user) => user.customer, {
    cascade: true,
  })
  users: User[];

  @OneToMany(() => Property, (property: Property) => property.customer, {
    cascade: true,
  })
  properties: Property[];
}
