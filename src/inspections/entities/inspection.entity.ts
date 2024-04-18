import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Property } from '../../properties/entities/property.entity';
import { Status } from '../enums/status.enum';
import { Device } from '../../devices/entities/device.entity';
import { Inspector } from '../../inspectors/entities/inspector.entity';

@Entity()
export class Inspection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  startDate: string;

  @Column({ nullable: true })
  endDate: string;

  @Column({ type: 'enum', enum: Status, default: Status.CREATED })
  status: Status;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property, (property: Property) => property.devices, {
    eager: true,
  })
  property: Property;

  @Column()
  deviceId: number;

  @ManyToOne(() => Device, (device: Device) => device.inspections, {
    eager: true,
  })
  device: Device;

  @Column()
  inspectorId: number;

  @ManyToOne(() => Inspector, (inspector: Inspector) => inspector.inspections, {
    eager: true,
  })
  inspector: Inspector;

  // @OneToMany(() => Component, (component: Component) => component.device, {
  //   cascade: false,
  // })
  // measurements: Component[];
}
