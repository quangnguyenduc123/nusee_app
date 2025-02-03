import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Agency } from '../../agency/entities';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agent) => agent.orders)
  @JoinColumn({ name: 'agent_id' })
  agent: Agency;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  order_date: Date;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
