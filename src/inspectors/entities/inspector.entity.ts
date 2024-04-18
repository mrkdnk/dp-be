import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Inspection } from '../../inspections/entities/inspection.entity';

@Entity()
export class Inspector extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licence: string;

  @Column({ type: 'timestamp' })
  licenceValidFrom: Date;

  @Column({ type: 'timestamp' })
  licenceValidTo: Date;

  @Column()
  certificate: string;

  @Column({ type: 'timestamp' })
  certificateValidFrom: Date;

  @Column({ type: 'timestamp' })
  certificateValidTo: Date;

  @Column({ nullable: true })
  userId: number;

  @OneToOne(() => User, (user) => user.inspector, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => Inspection,
    (inspection: Inspection) => inspection.inspector,
    {
      cascade: false,
    },
  )
  inspections: Inspection[];
}
