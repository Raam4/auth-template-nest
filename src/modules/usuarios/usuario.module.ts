import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { UsuariosService } from "./usuario.service";
import { UsuariosController } from "./usuario.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    exports: [UsuariosService],
    providers: [UsuariosService],
    controllers: [UsuariosController]
})
export class UsuariosModule {}