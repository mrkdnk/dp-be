import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { DeviceType } from '../../device-types/entities/device-type.entity';
import { Property } from '../../properties/entities/property.entity';
import { Component } from '../../components/entities/component.entity';
import { Inspection } from '../../inspections/entities/inspection.entity';

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property, (property: Property) => property.devices, {
    eager: true,
  })
  property: Property;

  @Column()
  deviceTypeId: number;

  @ManyToOne(() => DeviceType, (deviceType: DeviceType) => deviceType.devices, {
    eager: true,
  })
  deviceType: DeviceType;

  @OneToMany(() => Component, (component: Component) => component.device, {
    cascade: false,
  })
  components: Component[];

  @OneToMany(() => Inspection, (inspection: Inspection) => inspection.device, {
    cascade: false,
  })
  inspections: Inspection[];
}
