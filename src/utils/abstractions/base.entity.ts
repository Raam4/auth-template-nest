import {
    BaseEntity as TypeOrmBaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Entity,
} from 'typeorm';

@Entity()
export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @CreateDateColumn()
    public readonly created_at: Date;

    @UpdateDateColumn()
    public readonly updated_at: Date;

    @DeleteDateColumn()
    public readonly deleted_at: Date;
}
