import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name', type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ name: 'hash_password', type: 'text' })
  hashPassword: string;

  @Column({ name: 'role', type: 'varchar', length: 255 })
  role: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}
