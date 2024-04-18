import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export const MAGIC_CODE_REQUESTED: string = 'Magic code was requested';
export const MAGIC_CODE_REQUEST_FAILED: string = 'Magic code request failed';
export const MAGIC_CODE_EXPIRATION_TIME: number = 1000 * 60 * 3; // 3 minutes
export enum MagicCodeStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
}

@Entity()
export class MagicCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  ip: string;

  @Column({
    type: 'enum',
    enum: MagicCodeStatus,
    default: MagicCodeStatus.ACTIVE,
  })
  status: MagicCodeStatus;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.magicCodes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
