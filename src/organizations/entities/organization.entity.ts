import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export const ORGANIZATION_REMOVED: string = 'Organization was removed';

@Entity()
export class Organization extends BaseEntity {
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

  @Column()
  businessId: string;

  @Column()
  vatId: string;

  @OneToMany(() => User, (technician) => technician.organization, {
    cascade: true,
  })
  technicians: User[];
}
