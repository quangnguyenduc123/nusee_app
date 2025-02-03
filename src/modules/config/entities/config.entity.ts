import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('config')
export class Config{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json' })
    data: string;

    @CreateDateColumn({
        type: 'timestamp',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updated_at: Date;

}
