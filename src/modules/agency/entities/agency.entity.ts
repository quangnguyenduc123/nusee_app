import { Cart } from '../../cart/entities';
import { Order } from '../../order/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: false })
  level: number;

  @Index('idx_parent_id')
  @ManyToOne(() => Agency, (agency) => agency.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Agency;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ward: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ name: 'password', type: 'text', nullable: true })
  password: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Index()
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany(() => Agency, (agency) => agency.parent)
  children: Agency[];

  @OneToMany(() => Order, (order) => order.agent)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.agency)
  carts: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  setLevel() {
    this.level = this.parent ? this.parent.level + 1 : 1;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeSave() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
