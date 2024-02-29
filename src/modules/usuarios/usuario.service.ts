import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto, UpdateUsuarioDto } from './entities/usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>,
  ) {}

  async create(createDto: CreateUsuarioDto): Promise<Usuario> {
    const created = this.repository.create(createDto);
    await this.repository.save(created);
    return created;
  }

  findAll(): Promise<Usuario[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Usuario> {
    const found = await this.repository.findOne({ where: { id } });
    return found;
  }

  async findByEmail(email: string): Promise<Usuario> {
    const found = await this.repository.findOne({ where: { email } });
    return found;
  }

  async update(id: number, updateDto: UpdateUsuarioDto): Promise<Usuario> {
    if (updateDto.password != null) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    await this.repository.update(id, updateDto);
    const updatedUsuario = await this.findByEmail(updateDto.email);
    return updatedUsuario;
  }

  async remove(id: number) {
    const deleteResponse = await this.repository.softDelete(id);
    if (!deleteResponse.affected) throw new NotFoundException('No encontrado.');
  }

  async restore(id: number) {
    const restoreResponse = await this.repository.restore(id);
    if (!restoreResponse.affected)
      throw new NotFoundException('No encontrado.');
  }
}
