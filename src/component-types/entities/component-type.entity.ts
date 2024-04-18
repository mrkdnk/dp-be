import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Component } from '../../components/entities/component.entity';

@Entity()
export class ComponentType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => Component,
    (component: Component) => component.componentType,
    {
      cascade: false,
    },
  )
  components: Component[];
}
