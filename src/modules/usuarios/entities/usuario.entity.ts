import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../utils/abstractions/base.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Usuario extends BaseEntity {
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    @Exclude()
    password: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ default: false })
    verificado: boolean;

    @Column({ default: "user" })
    rol: string;
}
