import { Agency } from 'src/modules/agency/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  data: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column()
  user_id: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @ManyToOne(() => Agency, (agency) => agency.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agency_id' })
  agency: Agency;
}
