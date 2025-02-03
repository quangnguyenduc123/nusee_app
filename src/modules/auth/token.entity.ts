import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: ['admin', 'agency'],
    default: 'agency',
  })
  userType: string;

  @Column('varchar', {name: 'access_token', length: 255 })
  accessToken: string;

  @Column('varchar', {name: 'refresh_token', length: 255 }) // Specify a length for the refresh_token column
  @Index('IDX_REFRESH_TOKEN', { unique: true }) // Add an index with a key length
  refresh_token: string;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}
