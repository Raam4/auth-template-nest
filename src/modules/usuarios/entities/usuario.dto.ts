import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    password: string;

    @IsString()
    @MinLength(3)
    nombre: string;

    @IsString()
    @MinLength(3)
    apellido: string;

    @IsBoolean()
    @IsOptional()
    verificado: boolean;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}