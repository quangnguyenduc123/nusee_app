import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agency } from './agency.entity';

@Entity('agency_relationships')
export class AgencyRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agency) => agency.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Agency;

  @ManyToOne(() => Agency, (agency) => agency.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Agency;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
