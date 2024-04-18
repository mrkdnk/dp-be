import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ComponentType } from '../../component-types/entities/component-type.entity';
import { Device } from '../../devices/entities/device.entity';

@Entity()
export class Component extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  deviceId: number;

  @ManyToOne(() => Device, (device: Device) => device.components, {
    eager: true,
  })
  device: Device;

  @Column()
  componentTypeId: number;

  @ManyToOne(
    () => ComponentType,
    (componentType: ComponentType) => componentType.components,
    {
      eager: true,
    },
  )
  componentType: ComponentType;
}
