import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Device } from '../../devices/entities/device.entity';

@Entity()
export class DeviceType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Device, (device: Device) => device.deviceType, {
    cascade: false,
  })
  devices: Device[];
}
