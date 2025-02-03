import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../../product/entities';
import { CategoryStatus } from '../constant';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: CategoryStatus, default: 'active' })
  status: CategoryStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
